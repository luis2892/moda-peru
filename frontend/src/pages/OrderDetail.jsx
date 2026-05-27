import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard } from 'lucide-react'
import { formatPrice } from '../utils/helpers'

// Mock detalle — en producción viene de GET /api/ordenes/:id
const MOCK_ORDERS = {
  'ORD-001': {
    id: 'ORD-001', fecha: '2025-03-15', estado: 'Entregado',
    items: [
      { id: 1, nombre: 'Vestido Floral Bohemio', talla: 'M', color: 'Rosado', cantidad: 1, precio: 189, imagen: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&q=80' },
      { id: 2, nombre: 'Blusa Lino Premium',     talla: 'S', color: 'Beige',  cantidad: 1, precio: 89,  imagen: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80' },
    ],
    direccion: { nombre: 'María García', telefono: '+51 999 111 222', direccion: 'Av. Larco 456', distrito: 'Miraflores', ciudad: 'Lima' },
    metodo_pago: 'Visa terminada en 4242',
    numero_seguimiento: 'PE123456789',
  },
  'ORD-002': {
    id: 'ORD-002', fecha: '2025-02-20', estado: 'En camino',
    items: [
      { id: 3, nombre: 'Falda Midi Elegante', talla: 'M', color: 'Negro', cantidad: 1, precio: 189, imagen: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=300&q=80' },
    ],
    direccion: { nombre: 'María García', telefono: '+51 999 111 222', direccion: 'Av. Larco 456', distrito: 'Miraflores', ciudad: 'Lima' },
    metodo_pago: 'PayPal',
    numero_seguimiento: 'PE987654321',
  },
  'ORD-003': {
    id: 'ORD-003', fecha: '2025-01-10', estado: 'Entregado',
    items: [
      { id: 4, nombre: 'Chaqueta Cuero Sintético', talla: 'L',  color: 'Negro', cantidad: 1, precio: 299, imagen: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80' },
      { id: 5, nombre: 'Vestido Cóctel Negro',     talla: 'M',  color: 'Negro', cantidad: 1, precio: 220, imagen: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80' },
      { id: 6, nombre: 'Bolso Artesanal Lima',     talla: '-',  color: 'Beige', cantidad: 1, precio: 199, imagen: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80' },
    ],
    direccion: { nombre: 'María García', telefono: '+51 999 111 222', direccion: 'Av. Larco 456', distrito: 'Miraflores', ciudad: 'Lima' },
    metodo_pago: 'Visa terminada en 4242',
    numero_seguimiento: 'PE112233445',
  },
}

const ESTADO_STEPS = ['Pendiente', 'Pagado', 'Procesando', 'Enviado', 'Entregado']

const ESTADO_INFO = {
  'Entregado': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50',  step: 4 },
  'En camino': { icon: Truck,        color: 'text-blue-600',  bg: 'bg-blue-50',   step: 3 },
  'Procesando':{ icon: Clock,        color: 'text-yellow-600',bg: 'bg-yellow-50', step: 2 },
  'Pendiente': { icon: Clock,        color: 'text-gray-500',  bg: 'bg-gray-50',   step: 0 },
  'Cancelado': { icon: XCircle,      color: 'text-red-600',   bg: 'bg-red-50',    step: -1 },
}

export default function OrderDetail() {
  const { orderId } = useParams()
  const order = MOCK_ORDERS[orderId]

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package size={56} className="mx-auto text-gray-200 mb-4" />
        <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Orden no encontrada</h2>
        <Link to="/cuenta" className="btn-primary mt-4 inline-block">Volver a mis pedidos</Link>
      </div>
    )
  }

  const subtotal = order.items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const igv      = subtotal * 0.18
  const total    = subtotal + shipping + igv

  const estadoInfo = ESTADO_INFO[order.estado] || ESTADO_INFO['Pendiente']
  const { icon: EstadoIcon, color, bg, step } = estadoInfo

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link to="/cuenta" className="hover:text-gray-700">Mi cuenta</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700">Orden {order.id}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Orden {order.id}</h1>
          <p className="text-sm text-gray-400 mt-1">{order.fecha}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${bg} ${color}`}>
          <EstadoIcon size={15} />
          {order.estado}
        </span>
      </div>

      {/* Seguimiento */}
      {order.estado !== 'Cancelado' && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">Seguimiento del pedido</h2>
          <div className="flex items-center gap-0">
            {ESTADO_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    i <= step ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${i <= step ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {s}
                  </span>
                </div>
                {i < ESTADO_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          {order.numero_seguimiento && (
            <p className="text-xs text-gray-400 mt-4">
              N° seguimiento: <span className="font-medium text-gray-700">{order.numero_seguimiento}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Productos */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Productos ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.talla !== '-' && `Talla: ${item.talla}`}
                      {item.color && ` · ${item.color}`}
                      {` · Cant: ${item.cantidad}`}
                    </p>
                    <p className="text-primary-600 font-bold mt-2">{formatPrice(item.precio)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dirección */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary-500" /> Dirección de envío
            </h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.direccion.nombre}</p>
              <p>{order.direccion.direccion}</p>
              <p>{order.direccion.distrito}, {order.direccion.ciudad}</p>
              <p>{order.direccion.telefono}</p>
            </div>
          </div>

          {/* Pago */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-primary-500" /> Método de pago
            </h2>
            <p className="text-sm text-gray-600">{order.metodo_pago}</p>
          </div>
        </div>

        {/* Resumen */}
        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-semibold text-gray-900 mb-4">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>
                {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IGV (18%)</span><span>{formatPrice(igv)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link to="/cuenta" className="btn-outline w-full text-center block mt-5 text-sm">
            ← Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}
