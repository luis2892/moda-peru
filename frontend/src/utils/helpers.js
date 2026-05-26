export const formatPrice = (amount, currency = 'PEN') =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount)

export const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

export const truncate = (text, max = 100) =>
  text.length > max ? text.slice(0, max) + '...' : text

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL || ''}${path}`
}

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const COLORES = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Rojo', hex: '#EF4444' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Rosado', hex: '#EC4899' },
  { name: 'Beige', hex: '#D4B896' },
  { name: 'Gris', hex: '#6B7280' },
]

export const CATEGORIAS = [
  { slug: 'vestidos', label: 'Vestidos', icon: '👗' },
  { slug: 'blusas', label: 'Blusas', icon: '👚' },
  { slug: 'pantalones', label: 'Pantalones', icon: '👖' },
  { slug: 'faldas', label: 'Faldas', icon: '🩱' },
  { slug: 'chaquetas', label: 'Chaquetas', icon: '🧥' },
  { slug: 'accesorios', label: 'Accesorios', icon: '👜' },
]
