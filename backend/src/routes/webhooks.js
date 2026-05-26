const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const pool = require('../config/database')

router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const ordenId = session.metadata.orden_id
        await pool.execute(
          "UPDATE ordenes SET estado = 'pagado', fecha_pago = NOW() WHERE id = ?",
          [ordenId]
        )
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object
        if (intent.metadata?.orden_id) {
          await pool.execute(
            "UPDATE ordenes SET estado = 'fallido' WHERE id = ?",
            [intent.metadata.orden_id]
          )
        }
        break
      }
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

module.exports = router
