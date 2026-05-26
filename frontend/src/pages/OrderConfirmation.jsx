import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, Mail } from 'lucide-react'

export default function OrderConfirmation() {
  const { orderId } = useParams()

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={72} className="text-green-500" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
      <p className="text-gray-500 mb-1">Orden <span className="font-medium text-gray-900">#{orderId}</span></p>
      <p className="text-gray-500 mb-8">Recibirás un email de confirmación con los detalles de tu pedido.</p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4 text-left">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Mail size={16} className="text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Confirmación por email</p>
            <p className="text-gray-500 text-xs">Te enviamos los detalles de tu orden</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Package size={16} className="text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Seguimiento de envío</p>
            <p className="text-gray-500 text-xs">Puedes rastrear tu pedido desde tu cuenta</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/cuenta" className="btn-primary">Ver mis pedidos</Link>
        <Link to="/tienda" className="btn-outline">Seguir comprando</Link>
      </div>
    </div>
  )
}
