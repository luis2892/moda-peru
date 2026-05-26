import HeroSlider from '../components/home/HeroSlider'
import Categories from '../components/home/Categories'
import TrendingProducts from '../components/home/TrendingProducts'
import { Link } from 'react-router-dom'
import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Truck, title: 'Envío gratis', desc: 'En pedidos desde S/ 150' },
  { icon: RefreshCw, title: 'Devoluciones fáciles', desc: '30 días sin preguntas' },
  { icon: Shield, title: 'Pago seguro', desc: 'Stripe & PayPal certificados' },
  { icon: Headphones, title: 'Soporte 24/7', desc: 'Siempre disponibles para ti' },
]

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Features strip */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-100 rounded-xl flex-shrink-0">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Categories />
      <TrendingProducts />

      {/* Banner CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Moda con alma peruana
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Diseños únicos inspirados en nuestra cultura, con la calidad que mereces.
            </p>
            <Link to="/tienda" className="bg-white text-primary-700 font-bold px-10 py-4 rounded-full hover:bg-primary-50 transition-all inline-block">
              Descubrir colección
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Únete a nuestra comunidad
          </h3>
          <p className="text-gray-500 mb-6">
            Recibe primero las novedades, colecciones exclusivas y descuentos especiales.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="tu@email.com"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Suscribirme
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Sin spam. Cancela cuando quieras.</p>
        </div>
      </section>
    </>
  )
}
