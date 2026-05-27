const router = require('express').Router()
const pool = require('../config/database')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

router.get('/', async (req, res, next) => {
  try {
    const {
      categoria, buscar, trending, oferta,
      talla, color, precio_min, precio_max,
      orden = 'relevancia', page = 1, limit = 12,
    } = req.query

    let query = `
      SELECT p.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as reviews_count
      FROM productos p
      LEFT JOIN reviews r ON r.producto_id = p.id
      WHERE p.activo = 1
    `
    const params = []

    if (categoria) { query += ' AND p.categoria = ?'; params.push(categoria) }
    if (buscar) { query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)'; params.push(`%${buscar}%`, `%${buscar}%`) }
    if (trending === 'true') { query += ' AND p.es_trending = 1' }
    if (oferta === 'true') { query += ' AND p.descuento > 0' }
    if (precio_min) { query += ' AND p.precio >= ?'; params.push(Number(precio_min)) }
    if (precio_max) { query += ' AND p.precio <= ?'; params.push(Number(precio_max)) }

    query += ' GROUP BY p.id'

    const sortMap = {
      precio_asc: 'p.precio ASC',
      precio_desc: 'p.precio DESC',
      nuevo: 'p.created_at DESC',
      rating: 'rating DESC',
      relevancia: 'p.es_trending DESC, p.created_at DESC',
    }
    query += ` ORDER BY ${sortMap[orden] || sortMap.relevancia}`

    const offset = (Number(page) - 1) * Number(limit)
    query += ` LIMIT ? OFFSET ?`
    params.push(Number(limit), offset)

    const [products] = await pool.query(query, params)
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const [[product]] = await pool.execute(
      `SELECT p.*, COALESCE(AVG(r.rating), 0) as rating, COUNT(r.id) as reviews_count
       FROM productos p LEFT JOIN reviews r ON r.producto_id = p.id
       WHERE p.slug = ? AND p.activo = 1 GROUP BY p.id`,
      [req.params.slug]
    )
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })

    const [images] = await pool.execute('SELECT url FROM producto_imagenes WHERE producto_id = ? ORDER BY orden', [product.id])
    const [reviews] = await pool.execute(
      `SELECT r.*, u.nombre as usuario FROM reviews r JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.producto_id = ? ORDER BY r.created_at DESC LIMIT 10`,
      [product.id]
    )
    res.json({ ...product, imagenes: images.map((i) => i.url), reviews })
  } catch (err) {
    next(err)
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, slug, descuento = 0 } = req.body
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, slug, descuento) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, categoria, slug, descuento]
    )
    res.status(201).json({ id: result.insertId, message: 'Producto creado' })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const fields = ['nombre', 'descripcion', 'precio', 'stock', 'categoria', 'descuento', 'activo']
    const updates = fields.filter((f) => req.body[f] !== undefined)
    if (!updates.length) return res.status(400).json({ message: 'Sin campos para actualizar' })

    const query = `UPDATE productos SET ${updates.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`
    await pool.execute(query, [...updates.map((f) => req.body[f]), req.params.id])
    res.json({ message: 'Producto actualizado' })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/reviews', authMiddleware, async (req, res, next) => {
  try {
    const { rating, comentario } = req.body
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating debe ser entre 1 y 5' })
    await pool.execute(
      'INSERT INTO reviews (producto_id, usuario_id, rating, comentario) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, rating, comentario]
    )
    res.status(201).json({ message: 'Reseña agregada' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
