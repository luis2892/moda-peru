import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lock } from 'lucide-react'
import { formatPrice } from '../utils/helpers'
import useCartStore from '../store/cartStore'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STEPS = ['Información', 'Envío', 'Pago']

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    direccion: '', ciudad: 'Lima', distrito: '', codigo_postal: '',
    metodo_pago: 'stripe',
  })

  const subtotal = items.reduce((sum, i) => sum + i.precio * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const total = subtotal + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/ordenes', {
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.quantity, precio_unitario: i.precio })),
        total,
        direccion_envio: form,
        metodo_pago: form.metodo_pago,
      })
      clearCart()
      navigate(`/confirmacion/${data.orden_id}`)
    } catch (err) {
      toast.error('Hubo un error al procesar tu pedido. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/carrito')
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-sm font-medium ${
                i === step ? 'text-primary-600' : i < step ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {step === 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Información personal</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nombre *</label>
                  <input required name="nombre" value={form.nombre} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Apellido *</label>
                  <input required name="apellido" value={form.apellido} onChange={handleChange} className="input" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="input" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Teléfono *</label>
                  <input required name="telefono" value={form.telefono} onChange={handleChange} className="input" placeholder="+51 999 999 999" />
                </div>
              </div>
              <button type="button" onClick={handleNext} className="btn-primary mt-6 w-full">Continuar</button>
            </div>
          )}

          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Dirección de envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Dirección *</label>
                  <input required name="direccion" value={form.direccion} onChange={handleChange} className="input" placeholder="Av. Larco 123" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Ciudad</label>
                    <input name="ciudad" value={form.ciudad} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Distrito *</label>
                    <input required name="distrito" value={form.distrito} onChange={handleChange} className="input" placeholder="Miraflores" />
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleNext} className="btn-primary mt-6 w-full">Continuar</button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Método de pago</h2>
              <div className="space-y-3">
                {[
                  { value: 'stripe', label: 'Tarjeta de crédito/débito', desc: 'Visa, Mastercard, American Express' },
                  { value: 'paypal', label: 'PayPal', desc: 'Pago rápido y seguro con PayPal' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      form.metodo_pago === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodo_pago"
                      value={opt.value}
                      checked={form.metodo_pago === opt.value}
                      onChange={handleChange}
                      className="accent-primary-600"
                    />
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-6 w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Lock size={16} />
                {loading ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
              </button>
            </div>
          )}
        </form>

        {/* Order summary */}
        <div className="card p-5 sticky top-20 h-fit">
          <h3 className="font-semibold mb-4">Tu pedido</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3">
                <div className="relative">
                  <img src={item.imagen_principal} alt="" className="w-14 h-16 object-cover rounded-lg" />
                  <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium truncate">{item.nombre}</p>
                  <p className="text-gray-400 text-xs">{item.size}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.precio * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
