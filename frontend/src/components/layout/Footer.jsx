import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <span className="font-serif text-2xl font-bold text-white">
              Moda<span className="text-primary-500">Perú</span>
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Moda con identidad peruana. Prendas únicas que combinan tendencia y cultura.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2 bg-dark-700 rounded-full hover:bg-primary-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-dark-700 rounded-full hover:bg-primary-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-dark-700 rounded-full hover:bg-primary-600 transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tienda</h4>
            <ul className="space-y-2">
              {['Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Chaquetas', 'Accesorios'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/tienda/${cat.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2">
              {[
                { label: 'Guía de tallas', to: '/tallas' },
                { label: 'Envíos y devoluciones', to: '/envios' },
                { label: 'Preguntas frecuentes', to: '/faq' },
                { label: 'Política de privacidad', to: '/privacidad' },
                { label: 'Términos y condiciones', to: '/terminos' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-primary-500" />
                Lima, Perú
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={15} className="flex-shrink-0 text-primary-500" />
                +51 999 999 999
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={15} className="flex-shrink-0 text-primary-500" />
                hola@modaperu.com
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">Métodos de pago</p>
              <div className="flex items-center gap-2">
                <span className="bg-dark-700 text-xs px-2 py-1 rounded text-gray-300">Visa</span>
                <span className="bg-dark-700 text-xs px-2 py-1 rounded text-gray-300">Mastercard</span>
                <span className="bg-dark-700 text-xs px-2 py-1 rounded text-gray-300">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} ModaPerú. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-500">Hecho con ❤ en Lima, Perú</p>
        </div>
      </div>
    </footer>
  )
}
