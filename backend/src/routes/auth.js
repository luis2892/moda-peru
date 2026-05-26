const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const pool = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

router.post(
  '/register',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

    try {
      const { nombre, email, password } = req.body
      const hash = await bcrypt.hash(password, 12)
      const [result] = await pool.execute(
        'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
        [nombre, email, hash]
      )
      const user = { id: result.insertId, nombre, email, rol: 'cliente' }
      res.status(201).json({ user, token: signToken(user) })
    } catch (err) {
      next(err)
    }
  }
)

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const [[user]] = await pool.execute(
      'SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = ?',
      [email]
    )
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const { password_hash, ...safeUser } = user
    res.json({ user: safeUser, token: signToken(safeUser) })
  } catch (err) {
    next(err)
  }
})

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const [[user]] = await pool.execute(
      'SELECT id, nombre, email, telefono, rol, created_at FROM usuarios WHERE id = ?',
      [req.user.id]
    )
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

module.exports = router
