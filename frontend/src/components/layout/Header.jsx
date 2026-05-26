import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const openCart = useCartStore((s) => s.openCart)
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const { user, logout } = useAuthStore()

  const nav = [
    { to: '/tienda', label: 'Tienda' },
    { to: '/tienda/vestidos', label: 'Vestidos' },
    { to: '/tienda/blusas', label: 'Blusas' },
    { to: '/tienda/accesorios', label: 'Accesorios' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/tienda?buscar=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-serif text-2xl font-bold text-primary-600 tracking-tight">
              Moda<span className="text-gray-900">Perú</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="border border-gray-200 rounded-full px-4 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} className="text-gray-500" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-primary-600 transition-colors">
                <Search size={20} />
              </button>
            )}

            <Link to="/cuenta" className="p-2 hover:text-primary-600 transition-colors hidden md:block">
              <User size={20} />
            </Link>

            <Link to="/cuenta/wishlist" className="p-2 hover:text-primary-600 transition-colors hidden md:block">
              <Heart size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 hover:text-primary-600 transition-colors"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-1"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 pt-3 flex items-center gap-4">
            <Link to="/cuenta" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-primary-600">
              Mi cuenta
            </Link>
            {user && (
              <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500">
                Salir
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
