const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.type === 'StripeSignatureVerificationError') {
    return res.status(400).json({ message: 'Webhook signature inválida' })
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'El registro ya existe' })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
