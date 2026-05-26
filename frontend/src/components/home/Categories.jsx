import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIAS } from '../../utils/helpers'

const categoryImages = {
  vestidos: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
  blusas: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80',
  pantalones: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  faldas: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&q=80',
  chaquetas: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  accesorios: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
}

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
          Explora por categoría
        </h2>
        <p className="text-gray-500 mt-2">Encuentra lo que buscas en nuestra colección</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIAS.map(({ slug, label, icon }, i) => (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/tienda/${slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={categoryImages[slug]}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                <span className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow">
                  {label}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
