import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, Edit2, Trash2, Plus, ChevronRight, X, Check } from 'lucide-react'
import { formatPrice } from '../utils/helpers'
import useAuthStore from '../store/authStore'
import api from '../utils/api'

const MOCK_PRODUCTS = [
  { id: 1, nombre: 'Vestido Floral Bohemio', categoria: 'vestidos', precio: 189, stock: 25, activo: true },
  { id: 2, nombre: 'Blusa Lino Premium',     categoria: 'blusas',   precio: 89,  stock: 40, activo: true },
  { id: 3, nombre: 'Falda Midi Elegante',     categoria: 'faldas',   precio: 135, stock: 18, activo: true },
  { id: 4, nombre: 'Chaqueta Cuero Sintético',categoria: 'chaquetas',precio: 299, stock: 10, activo: true },
  { id: 5, nombre: 'Pantalón Wide Leg',       categoria: 'pantalones',precio: 145, stock: 30, activo: false },
  { id: 6, nombre: 'Bolso Artesanal Lima',    categoria: 'accesorios',precio: 199, stock: 8,  activo: true },
]

const MOCK_ORDERS = [
  { id: 'ORD-001', cliente: 'María García',  total: 348, estado: 'pagado',     fecha: '2025-03-15', items: 2 },
  { id: 'ORD-002', cliente: 'Carlos Pérez',  total: 189, estado: 'enviado',    fecha: '2025-03-14', items: 1 },
  { id: 'ORD-003', cliente: 'Ana Torres',    total: 520, estado: 'pendiente',  fecha: '2025-03-13', items: 3 },
  { id: 'ORD-004', cliente: 'Luis Ramos',    total: 89,  estado: 'entregado',  fecha: '2025-03-12', items: 1 },
  { id: 'ORD-005', cliente: 'Rosa Huanca',   total: 638, estado: 'pagado',     fecha: '2025-03-11', items: 4 },
]

const ESTADO_COLOR = {
  pendiente:  'bg-yellow-100 text-yellow-700',
  pagado:     'bg-blue-100 text-blue-700',
  enviado:    'bg-purple-100 text-purple-700',
  entregado:  'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
}

const ESTADOS = ['pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado']

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
  { id: 'productos', label: 'Inventario', icon: Package },
  { id: 'ordenes',   label: 'Órdenes',   icon: ShoppingBag },
]

export default function Admin() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('dashboard')
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [orders, setOrders]     = useState(MOCK_ORDERS)
  const [editProduct, setEditProduct] = useState(null)

  if (!user) return <Navigate to="/login" />
  if (user.rol !== 'admin') return <Navigate to="/" />

  const totalRevenue  = orders.filter(o => o.estado !== 'cancelado').reduce((s, o) => s + o.total, 0)
  const totalOrders   = orders.length
  const lowStock      = products.filter(p => p.stock < 10).length
  const activeProducts = products.filter(p => p.activo).length

  const handleToggleActive = (id) =>
    setProducts(products.map(p => p.id === id ? { ...p, activo: !p.activo } : p))

  const handleOrderStatus = (id, estado) =>
    setOrders(orders.map(o => o.id === id ? { ...o, estado } : o))

  const handleSaveProduct = () => {
    if (!editProduct) return
    if (editProduct.id) {
      setProducts(products.map(p => p.id === editProduct.id ? editProduct : p))
    } else {
      setProducts([...products, { ...editProduct, id: Date.now(), activo: true }])
    }
    setEditProduct(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">ModaPerú — gestión de tienda</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Ingresos totales', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
              { label: 'Total órdenes',    value: totalOrders,              icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
              { label: 'Productos activos',value: activeProducts,            icon: Package,    color: 'text-primary-600 bg-primary-50' },
              { label: 'Stock bajo',       value: lowStock,                  icon: Users,      color: 'text-red-600 bg-red-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <h2 className="font-semibold text-gray-900 mb-4">Últimas órdenes</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Orden', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">{o.cliente}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3"><span className={`badge ${ESTADO_COLOR[o.estado]}`}>{o.estado}</span></td>
                    <td className="px-4 py-3 text-gray-400">{o.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── INVENTARIO ── */}
      {tab === 'productos' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{products.length} productos</p>
            <button
              onClick={() => setEditProduct({ nombre: '', categoria: 'vestidos', precio: 0, stock: 0 })}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Nuevo producto
            </button>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.categoria}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.precio)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                        {p.stock} uds
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(p.id)} className={`badge cursor-pointer ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditProduct({ ...p })} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal edición */}
          {editProduct && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">{editProduct.id ? 'Editar producto' : 'Nuevo producto'}</h3>
                  <button onClick={() => setEditProduct(null)}><X size={18} className="text-gray-400" /></button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Nombre', key: 'nombre', type: 'text' },
                    { label: 'Precio (S/)', key: 'precio', type: 'number' },
                    { label: 'Stock', key: 'stock', type: 'number' },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
                      <input
                        type={type}
                        value={editProduct[key]}
                        onChange={e => setEditProduct({ ...editProduct, [key]: e.target.value })}
                        className="input"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Categoría</label>
                    <select
                      value={editProduct.categoria}
                      onChange={e => setEditProduct({ ...editProduct, categoria: e.target.value })}
                      className="input"
                    >
                      {['vestidos','blusas','pantalones','faldas','chaquetas','accesorios'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSaveProduct} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Check size={16} /> Guardar
                  </button>
                  <button onClick={() => setEditProduct(null)} className="btn-outline flex-1">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ÓRDENES ── */}
      {tab === 'ordenes' && (
        <div>
          <p className="text-sm text-gray-500 mb-5">{orders.length} órdenes en total</p>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Orden', 'Cliente', 'Items', 'Total', 'Estado', 'Fecha'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">{o.cliente}</td>
                    <td className="px-4 py-3 text-gray-500">{o.items}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.estado}
                        onChange={e => handleOrderStatus(o.id, e.target.value)}
                        className={`badge cursor-pointer border-0 ${ESTADO_COLOR[o.estado]} text-xs font-medium`}
                      >
                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{o.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
