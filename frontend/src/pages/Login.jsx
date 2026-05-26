import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success('Bienvenida de vuelta!')
      navigate('/cuenta')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-12">
          <div>
            <span className="font-serif text-3xl font-bold text-white">ModaPerú</span>
            <p className="text-white/80 text-sm mt-2">Moda con alma peruana</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link to="/" className="font-serif text-2xl font-bold text-primary-600">
              Moda<span className="text-gray-900">Perú</span>
            </Link>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mb-8">Ingresa a tu cuenta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Link to="/recuperar-password" className="text-xs text-primary-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary-600 font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>

          <Link to="/" className="block text-center text-xs text-gray-400 mt-8 hover:text-gray-600">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
