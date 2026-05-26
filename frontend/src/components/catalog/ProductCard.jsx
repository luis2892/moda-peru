import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice, getImageUrl, slugify } from '../../utils/helpers'
import useCartStore from '../../store/cartStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const images = product.imagenes || [product.imagen_principal]
  const slug = product.slug || slugify(product.nombre)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addItem(product, 1, 'M', null)
    openCart()
    toast.success('Agregado al carrito')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link to={`/producto/${slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
          <img
            src={getImageUrl(images[imageIdx])}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => images[1] && setImageIdx(1)}
            onMouseLeave={() => setImageIdx(0)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.es_nuevo && (
              <span className="badge bg-primary-600 text-white">Nuevo</span>
            )}
            {product.descuento > 0 && (
              <span className="badge bg-red-500 text-white">-{product.descuento}%</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart
              size={16}
              className={wishlist ? 'fill-primary-500 text-primary-500' : 'text-gray-400'}
            />
          </button>

          {/* Quick add */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-white text-gray-900 text-sm font-medium py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-600 hover:text-white flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag size={15} />
            Agregar al carrito
          </button>
        </div>

        {/* Info */}
        <div className="mt-3 px-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{product.categoria}</p>
          <p className="font-medium text-gray-900 mt-0.5 truncate">{product.nombre}</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{formatPrice(product.precio)}</span>
              {product.precio_original > product.precio && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.precio_original)}
                </span>
              )}
            </div>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {product.rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
