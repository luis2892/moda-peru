import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'
import ProductCard from '../components/catalog/ProductCard'
import ProductFilters from '../components/catalog/ProductFilters'
import api from '../utils/api'

const MOCK = [
  { id: 1, nombre: 'Vestido Floral Bohemio', categoria: 'vestidos', precio: 189, precio_original: 240, rating: 4.8, es_nuevo: true, descuento: 21, imagen_principal: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80' },
  { id: 2, nombre: 'Blusa Lino Premium', categoria: 'blusas', precio: 89, precio_original: 89, rating: 4.5, es_nuevo: false, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
  { id: 3, nombre: 'Falda Midi Elegante', categoria: 'faldas', precio: 135, precio_original: 135, rating: 4.7, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&q=80' },
  { id: 4, nombre: 'Chaqueta Cuero Sintético', categoria: 'chaquetas', precio: 299, precio_original: 380, rating: 4.9, es_nuevo: false, descuento: 21, imagen_principal: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 5, nombre: 'Vestido Cóctel Negro', categoria: 'vestidos', precio: 220, precio_original: 220, rating: 4.6, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' },
  { id: 6, nombre: 'Conjunto Casual Beige', categoria: 'blusas', precio: 159, precio_original: 200, rating: 4.4, es_nuevo: false, descuento: 20, imagen_principal: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80' },
  { id: 7, nombre: 'Pantalón Wide Leg', categoria: 'pantalones', precio: 145, precio_original: 145, rating: 4.7, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80' },
  { id: 8, nombre: 'Bolso Artesanal Lima', categoria: 'accesorios', precio: 199, precio_original: 199, rating: 5.0, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
  { id: 9, nombre: 'Vestido Maxi Plisado', categoria: 'vestidos', precio: 259, precio_original: 259, rating: 4.3, es_nuevo: false, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80' },
  { id: 10, nombre: 'Top Brodado Peruano', categoria: 'blusas', precio: 75, precio_original: 95, rating: 4.8, es_nuevo: true, descuento: 21, imagen_principal: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80' },
  { id: 11, nombre: 'Pantalón Palazzo Crema', categoria: 'pantalones', precio: 165, precio_original: 165, rating: 4.5, es_nuevo: false, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
  { id: 12, nombre: 'Collar Tejido Artesanal', categoria: 'accesorios', precio: 55, precio_original: 55, rating: 4.9, es_nuevo: true, descuento: 0, imagen_principal: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
]

const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nuevo', label: 'Más nuevos' },
  { value: 'rating', label: 'Mejor valorados' },
]

export default function Catalog() {
  const { categoria } = useParams()
  const [searchParams] = useSearchParams()
  const buscar = searchParams.get('buscar')

  const [products, setProducts] = useState(MOCK)
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState('relevancia')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const filteredProducts = products
    .filter((p) => {
      if (categoria && p.categoria !== categoria) return false
      if (buscar && !p.nombre.toLowerCase().includes(buscar.toLowerCase())) return false
      if (filters.categorias?.length && !filters.categorias.includes(p.categoria)) return false
      if (filters.precioMin !== undefined && p.precio < filters.precioMin) return false
      if (filters.precioMax !== undefined && p.precio > filters.precioMax) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'precio_asc') return a.precio - b.precio
      if (sort === 'precio_desc') return b.precio - a.precio
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'nuevo') return b.es_nuevo - a.es_nuevo
      return 0
    })

  const pageTitle = categoria
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
    : buscar
    ? `Resultados para "${buscar}"`
    : 'Toda la tienda'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {/* View mode */}
          <div className="hidden md:flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm md:hidden"
          >
            <SlidersHorizontal size={15} />
            Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters - desktop */}
        <div className="hidden md:block">
          <ProductFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Products */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No se encontraron productos</p>
              <button onClick={() => setFilters({})} className="mt-3 text-primary-600 text-sm hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
