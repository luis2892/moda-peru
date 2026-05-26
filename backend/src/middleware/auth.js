const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No autorizado' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user?.rol !== 'admin') return res.status(403).json({ message: 'Acceso denegado' })
  next()
}

module.exports = { authMiddleware, adminMiddleware }
