import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../../store/cartStore'
import { formatPrice, getImageUrl } from '../../utils/helpers'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((sum, i) => sum + i.precio * i.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <span className="font-semibold">
                  Carrito ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>
              </div>
              <button onClick={closeCart} className="p-1.5 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag size={48} className="text-gray-200" />
                  <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm"
                  >
                    Explorar tienda
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <img
                      src={getImageUrl(item.imagen_principal)}
                      alt={item.nombre}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.talla && `Talla: ${item.talla}`}
                        {item.color && ` · ${item.color}`}
                      </p>
                      <p className="text-primary-600 font-semibold text-sm mt-1">
                        {formatPrice(item.precio)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400">Envío calculado en el checkout</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center block"
                >
                  Ir al checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="btn-outline w-full text-center text-sm"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
