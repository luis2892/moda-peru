require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/users')
const webhookRoutes = require('./routes/webhooks')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))

// Webhook needs raw body before json parser
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Demasiadas solicitudes' })
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/productos', productRoutes)
app.use('/api/ordenes', orderRoutes)
app.use('/api/usuarios', userRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`))

module.exports = app
