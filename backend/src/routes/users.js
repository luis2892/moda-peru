const router = require('express').Router()
const bcrypt = require('bcryptjs')
const pool = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

router.put('/me', authMiddleware, async (req, res, next) => {
  try {
    const { nombre, telefono } = req.body
    await pool.execute(
      'UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?',
      [nombre, telefono, req.user.id]
    )
    res.json({ message: 'Perfil actualizado' })
  } catch (err) {
    next(err)
  }
})

router.put('/me/password', authMiddleware, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body
    const [[user]] = await pool.execute('SELECT password_hash FROM usuarios WHERE id = ?', [req.user.id])

    if (!(await bcrypt.compare(current_password, user.password_hash))) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' })
    }
    const hash = await bcrypt.hash(new_password, 12)
    await pool.execute('UPDATE usuarios SET password_hash = ? WHERE id = ?', [hash, req.user.id])
    res.json({ message: 'Contraseña actualizada' })
  } catch (err) {
    next(err)
  }
})

router.get('/me/wishlist', authMiddleware, async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      `SELECT p.* FROM wishlist w JOIN productos p ON p.id = w.producto_id WHERE w.usuario_id = ?`,
      [req.user.id]
    )
    res.json(items)
  } catch (err) {
    next(err)
  }
})

router.post('/me/wishlist/:productoId', authMiddleware, async (req, res, next) => {
  try {
    await pool.execute(
      'INSERT IGNORE INTO wishlist (usuario_id, producto_id) VALUES (?, ?)',
      [req.user.id, req.params.productoId]
    )
    res.json({ message: 'Agregado a wishlist' })
  } catch (err) {
    next(err)
  }
})

router.delete('/me/wishlist/:productoId', authMiddleware, async (req, res, next) => {
  try {
    await pool.execute(
      'DELETE FROM wishlist WHERE usuario_id = ? AND producto_id = ?',
      [req.user.id, req.params.productoId]
    )
    res.json({ message: 'Eliminado de wishlist' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
