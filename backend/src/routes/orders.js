const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const pool = require('../config/database')
const { authMiddleware } = require('../middleware/auth')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

router.post('/', authMiddleware, async (req, res, next) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const { items, total, direccion_envio, metodo_pago } = req.body

    for (const item of items) {
      const [[prod]] = await conn.execute(
        'SELECT stock FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id]
      )
      if (!prod || prod.stock < item.cantidad) {
        await conn.rollback()
        return res.status(400).json({ message: `Stock insuficiente para producto ${item.producto_id}` })
      }
    }

    const [orderResult] = await conn.execute(
      `INSERT INTO ordenes (usuario_id, total, estado, direccion_envio, metodo_pago)
       VALUES (?, ?, 'pendiente', ?, ?)`,
      [req.user.id, total, JSON.stringify(direccion_envio), metodo_pago]
    )
    const ordenId = orderResult.insertId

    for (const item of items) {
      await conn.execute(
        'INSERT INTO items_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [ordenId, item.producto_id, item.cantidad, item.precio_unitario]
      )
      await conn.execute(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      )
    }

    let paymentUrl = null
    if (metodo_pago === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((i) => ({
          price_data: {
            currency: 'pen',
            product_data: { name: `Producto #${i.producto_id}` },
            unit_amount: Math.round(i.precio_unitario * 100),
          },
          quantity: i.cantidad,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/confirmacion/${ordenId}`,
        cancel_url: `${process.env.FRONTEND_URL}/carrito`,
        metadata: { orden_id: ordenId.toString() },
      })
      paymentUrl = session.url
      await conn.execute('UPDATE ordenes SET stripe_session_id = ? WHERE id = ?', [session.id, ordenId])
    }

    await conn.commit()

    transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@modaperu.com',
      to: direccion_envio.email,
      subject: `ModaPerú - Orden #${ordenId} confirmada`,
      html: `<p>Hola ${direccion_envio.nombre},</p><p>Tu orden <strong>#${ordenId}</strong> ha sido recibida. Total: S/ ${total}</p>`,
    }).catch(() => {})

    res.status(201).json({ orden_id: ordenId, payment_url: paymentUrl })
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    conn.release()
  }
})

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, COUNT(io.id) as total_items
       FROM ordenes o LEFT JOIN items_orden io ON io.orden_id = o.id
       WHERE o.usuario_id = ? GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    )
    res.json(orders)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const [[order]] = await pool.execute(
      'SELECT * FROM ordenes WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.user.id]
    )
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' })

    const [items] = await pool.execute(
      `SELECT io.*, p.nombre, p.imagen_principal
       FROM items_orden io JOIN productos p ON p.id = io.producto_id
       WHERE io.orden_id = ?`,
      [order.id]
    )
    res.json({ ...order, items })
  } catch (err) {
    next(err)
  }
})

module.exports = router
