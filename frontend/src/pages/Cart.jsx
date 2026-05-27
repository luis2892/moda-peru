import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react'
import { formatPrice, getImageUrl } from '../utils/helpers'
import useCartStore from '../store/cartStore'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.precio * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const igv = subtotal * 0.18
  const total = subtotal + shipping + igv

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Explora nuestra tienda y encuentra algo que te encante.</p>
        <Link to="/tienda" className="btn-primary">Ir a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Carrito ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="card p-4 flex gap-4">
              <img
                src={getImageUrl(item.imagen_principal)}
                alt={item.nombre}
                className="w-24 h-28 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{item.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.size && `Talla: ${item.size}`}
                  {item.color && ` · ${item.color}`}
                </p>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(item.precio)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                      <Minus size={14} className="text-gray-500" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                      <Plus size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatPrice(item.precio * item.quantity)}</span>
                    <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 text-lg mb-5">Resumen del pedido</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">Gratis</span>
                ) : (
                  <span>{formatPrice(shipping)}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Agrega {formatPrice(150 - subtotal)} más para envío gratis
                </p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>IGV (18%)</span>
                <span>{formatPrice(igv)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center block mt-6 flex items-center justify-center gap-2">
              Proceder al pago
              <ArrowRight size={16} />
            </Link>
            <Link to="/tienda" className="btn-outline w-full text-center block mt-3 text-sm">
              Seguir comprando
            </Link>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">Pago seguro con</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map((p) => (
                  <span key={p} className="text-xs border border-gray-200 px-2 py-1 rounded text-gray-500">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
