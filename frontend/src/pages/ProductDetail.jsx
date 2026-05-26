import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Truck, RefreshCw, Shield, ChevronRight, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice, TALLAS, COLORES } from '../utils/helpers'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

const MOCK_PRODUCT = {
  id: 1,
  nombre: 'Vestido Floral Bohemio',
  categoria: 'vestidos',
  precio: 189,
  precio_original: 240,
  rating: 4.8,
  reviews_count: 128,
  es_nuevo: true,
  descuento: 21,
  descripcion: 'Vestido largo con estampado floral inspirado en los patrones textiles andinos. Confeccionado en tela de algodón premium con corte A-line que favorece todo tipo de siluetas. Perfecto para ocasiones casuales y semi-formales.',
  imagenes: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  ],
  colores_disponibles: ['Negro', 'Rosado', 'Beige'],
  stock: 12,
}

const MOCK_REVIEWS = [
  { id: 1, usuario: 'María G.', rating: 5, fecha: '2025-03-10', texto: 'Hermoso vestido, la tela es suave y el talle es perfecto. Lo recomiendo mucho.' },
  { id: 2, usuario: 'Sofía R.', rating: 4, fecha: '2025-03-05', texto: 'Me encantó el diseño, los colores son exactamente como en la foto.' },
  { id: 3, usuario: 'Camila T.', rating: 5, fecha: '2025-02-28', texto: 'Excelente calidad, llegó en perfectas condiciones y el envío fue rápido.' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const product = MOCK_PRODUCT
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Selecciona una talla')
    addItem(product, quantity, selectedSize, selectedColor)
    openCart()
    toast.success('Agregado al carrito')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-700">Inicio</Link>
        <ChevronRight size={12} />
        <Link to="/tienda" className="hover:text-gray-700">Tienda</Link>
        <ChevronRight size={12} />
        <Link to={`/tienda/${product.categoria}`} className="hover:text-gray-700 capitalize">{product.categoria}</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 truncate max-w-xs">{product.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]">
            <motion.img
              key={selectedImage}
              src={product.imagenes[selectedImage]}
              alt={product.nombre}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full object-cover"
            />
            {product.es_nuevo && (
              <span className="absolute top-4 left-4 badge bg-primary-600 text-white">Nuevo</span>
            )}
            {product.descuento > 0 && (
              <span className="absolute top-4 left-20 badge bg-red-500 text-white">-{product.descuento}%</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === i ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.categoria}</p>
            <h1 className="font-serif text-3xl font-bold text-gray-900">{product.nombre}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews_count} reseñas)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-3xl text-gray-900">{formatPrice(product.precio)}</span>
            {product.precio_original > product.precio && (
              <span className="text-gray-400 line-through text-lg">{formatPrice(product.precio_original)}</span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{product.descripcion}</p>

          {/* Color */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Color: <span className="text-gray-500">{selectedColor || 'Seleccionar'}</span>
            </p>
            <div className="flex items-center gap-2">
              {COLORES.filter((c) => product.colores_disponibles.includes(c.name)).map(({ name, hex }) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => setSelectedColor(name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === name ? 'border-primary-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Talla */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Talla</p>
              <button className="text-xs text-primary-600 hover:underline">Guía de tallas</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {TALLAS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedSize(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                    selectedSize === t
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={16} className="text-gray-500" />
              </button>
              <span className="font-medium w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <Plus size={16} className="text-gray-500" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Agregar al carrito
            </button>
            <button
              onClick={() => setWishlist(!wishlist)}
              className="p-3 border border-gray-200 rounded-xl hover:border-primary-500 transition-all"
            >
              <Heart size={20} className={wishlist ? 'fill-primary-500 text-primary-500' : 'text-gray-400'} />
            </button>
          </div>

          <p className="text-xs text-green-600 font-medium">
            ✓ {product.stock} unidades disponibles
          </p>

          {/* Guarantees */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
            {[
              { icon: Truck, text: 'Envío gratis en pedidos desde S/ 150' },
              { icon: RefreshCw, text: 'Devolución gratuita hasta 30 días' },
              { icon: Shield, text: 'Pago 100% seguro y encriptado' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                <Icon size={16} className="text-primary-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
          Reseñas ({MOCK_REVIEWS.length})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-3">{review.texto}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium text-gray-700">{review.usuario}</span>
                <span>{review.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
