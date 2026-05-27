import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package, User, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { formatPrice } from '../utils/helpers'

const MOCK_ORDERS = [
  { id: 'ORD-001', fecha: '2025-03-15', total: 348, estado: 'Entregado', items: 2 },
  { id: 'ORD-002', fecha: '2025-02-20', total: 189, estado: 'En camino', items: 1 },
  { id: 'ORD-003', fecha: '2025-01-10', total: 520, estado: 'Entregado', items: 3 },
]

const ESTADO_COLORS = {
  'Entregado': 'bg-green-100 text-green-700',
  'En camino': 'bg-blue-100 text-blue-700',
  'Procesando': 'bg-yellow-100 text-yellow-700',
  'Cancelado': 'bg-red-100 text-red-700',
}

const TABS = [
  { id: 'ordenes', label: 'Mis pedidos', icon: Package },
  { id: 'perfil', label: 'Mi perfil', icon: User },
  { id: 'direcciones', label: 'Direcciones', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
]

export default function Account() {
  const { user, logout } = useAuthStore()
  const [tab, setTab] = useState('ordenes')

  if (!user) return <Navigate to="/login" />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Mi cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Hola, {user.nombre}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {label}
                <ChevronRight size={14} className="ml-auto" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {tab === 'ordenes' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Mis pedidos</h2>
              {MOCK_ORDERS.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No tienes pedidos aún</p>
                  <Link to="/tienda" className="btn-primary mt-4 inline-block text-sm">Explorar tienda</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {MOCK_ORDERS.map((order) => (
                    <Link key={order.id} to={`/cuenta/orden/${order.id}`} className="card p-5 flex items-center justify-between hover:border-primary-200 hover:shadow-md transition-all block">
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.fecha} · {order.items} {order.items === 1 ? 'producto' : 'productos'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`badge ${ESTADO_COLORS[order.estado]}`}>{order.estado}</span>
                        <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'perfil' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Datos personales</h2>
              <div className="card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Nombre</label>
                    <input defaultValue={user.nombre} className="input" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Email</label>
                    <input defaultValue={user.email} type="email" className="input" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Teléfono</label>
                    <input defaultValue={user.telefono || ''} className="input" placeholder="+51 999 999 999" />
                  </div>
                </div>
                <button className="btn-primary">Guardar cambios</button>
              </div>
            </div>
          )}

          {tab === 'direcciones' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Mis direcciones</h2>
              <div className="text-center py-12 text-gray-400">
                <MapPin size={48} className="mx-auto mb-3 opacity-50" />
                <p>No tienes direcciones guardadas</p>
                <button className="btn-outline mt-4 text-sm">Agregar dirección</button>
              </div>
            </div>
          )}

          {tab === 'wishlist' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Mi wishlist</h2>
              <div className="text-center py-12 text-gray-400">
                <Heart size={48} className="mx-auto mb-3 opacity-50" />
                <p>Tu wishlist está vacía</p>
                <Link to="/tienda" className="btn-outline mt-4 inline-block text-sm">Explorar tienda</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
