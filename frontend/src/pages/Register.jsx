import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Las contraseñas no coinciden')
    if (form.password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres')
    const result = await register(form.nombre, form.email, form.password)
    if (result.success) {
      toast.success('¡Cuenta creada! Bienvenida.')
      navigate('/cuenta')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl font-bold text-primary-600">
            Moda<span className="text-gray-900">Perú</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mt-4 mb-1">Crear cuenta</h1>
          <p className="text-sm text-gray-500">Es gratis y solo toma un minuto</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nombre completo</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="input"
                placeholder="María García"
              />
            </div>
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
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmar contraseña</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="input"
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Al registrarte aceptas nuestros{' '}
            <Link to="/terminos" className="text-primary-600 hover:underline">Términos</Link>
            {' '}y{' '}
            <Link to="/privacidad" className="text-primary-600 hover:underline">Política de privacidad</Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
