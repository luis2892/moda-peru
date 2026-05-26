import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../catalog/ProductCard'
import api from '../../utils/api'

const MOCK_PRODUCTS = [
  { id: 1, nombre: 'Vestido Floral Bohemio', categoria: 'vestidos', precio: 189, precio_original: 240, rating: 4.8, es_nuevo: true, descuento: 21, imagen_principal: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80' },
  { id: 2, nombre: 'Blusa Lino Premium', categoria: 'blusas', precio: 89, precio_original: 89, rating: 4.5, es_nuevo: false, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
  { id: 3, nombre: 'Falda Midi Elegante', categoria: 'faldas', precio: 135, precio_original: 135, rating: 4.7, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&q=80' },
  { id: 4, nombre: 'Chaqueta Cuero Sintético', categoria: 'chaquetas', precio: 299, precio_original: 380, rating: 4.9, es_nuevo: false, descuento: 21, imagen_principal: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 5, nombre: 'Vestido Cóctel Negro', categoria: 'vestidos', precio: 220, precio_original: 220, rating: 4.6, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' },
  { id: 6, nombre: 'Conjunto Casual Beige', categoria: 'blusas', precio: 159, precio_original: 200, rating: 4.4, es_nuevo: false, descuento: 20, imagen_principal: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80' },
  { id: 7, nombre: 'Pantalón Wide Leg', categoria: 'pantalones', precio: 145, precio_original: 145, rating: 4.7, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80' },
  { id: 8, nombre: 'Bolso Artesanal Lima', categoria: 'accesorios', precio: 199, precio_original: 199, rating: 5.0, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
]

export default function TrendingProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)

  useEffect(() => {
    api.get('/productos?trending=true&limit=8')
      .then(({ data }) => { if (data?.length) setProducts(data) })
      .catch(() => {})
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
            Lo más popular
          </h2>
          <p className="text-gray-500 mt-1">Prendas favoritas de nuestra comunidad</p>
        </div>
        <Link
          to="/tienda"
          className="hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
        >
          Ver todo <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-10 md:hidden">
        <Link to="/tienda" className="btn-outline">Ver todos los productos</Link>
      </div>
    </section>
  )
}
