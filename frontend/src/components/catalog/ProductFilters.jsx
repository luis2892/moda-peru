import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { TALLAS, COLORES, CATEGORIAS, formatPrice } from '../../utils/helpers'

export default function ProductFilters({ filters, onChange }) {
  const [open, setOpen] = useState({ categoria: true, talla: true, color: false, precio: false })

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }))

  const handleMulti = (key, value) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const hasFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v
  )

  return (
    <div className="w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal size={18} />
          Filtros
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-primary-600 hover:underline flex items-center gap-1"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Categorías */}
      <FilterSection label="Categoría" open={open.categoria} onToggle={() => toggle('categoria')}>
        <div className="space-y-2">
          {CATEGORIAS.map(({ slug, label }) => (
            <label key={slug} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.categorias || []).includes(slug)}
                onChange={() => handleMulti('categorias', slug)}
                className="accent-primary-600 w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Tallas */}
      <FilterSection label="Talla" open={open.talla} onToggle={() => toggle('talla')}>
        <div className="flex flex-wrap gap-2">
          {TALLAS.map((t) => (
            <button
              key={t}
              onClick={() => handleMulti('tallas', t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                (filters.tallas || []).includes(t)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colores */}
      <FilterSection label="Color" open={open.color} onToggle={() => toggle('color')}>
        <div className="flex flex-wrap gap-2">
          {COLORES.map(({ name, hex }) => (
            <button
              key={name}
              title={name}
              onClick={() => handleMulti('colores', name)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                (filters.colores || []).includes(name)
                  ? 'border-primary-500 scale-110'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Precio */}
      <FilterSection label="Precio" open={open.precio} onToggle={() => toggle('precio')}>
        <div className="space-y-3">
          {[
            { label: 'Hasta S/ 50', min: 0, max: 50 },
            { label: 'S/ 50 - S/ 100', min: 50, max: 100 },
            { label: 'S/ 100 - S/ 200', min: 100, max: 200 },
            { label: 'Más de S/ 200', min: 200, max: 9999 },
          ].map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="precio"
                checked={filters.precioMin === range.min && filters.precioMax === range.max}
                onChange={() =>
                  onChange({ ...filters, precioMin: range.min, precioMax: range.max })
                }
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-sm text-gray-900">{label}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}
