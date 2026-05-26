import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'Nueva Colección',
    subtitle: 'Primavera 2025',
    description: 'Descubre las últimas tendencias en moda peruana con diseños únicos y auténticos.',
    cta: 'Ver colección',
    ctaLink: '/tienda',
    bg: 'from-rose-950 to-pink-900',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  },
  {
    id: 2,
    title: 'Vestidos Elegantes',
    subtitle: 'Para cada ocasión',
    description: 'Cortes sofisticados que realzan tu figura para cualquier evento especial.',
    cta: 'Explorar vestidos',
    ctaLink: '/tienda/vestidos',
    bg: 'from-slate-900 to-gray-800',
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  },
  {
    id: 3,
    title: 'Hasta 40% OFF',
    subtitle: 'Temporada de descuentos',
    description: 'Aprovecha nuestras ofertas especiales en prendas seleccionadas.',
    cta: 'Ver ofertas',
    ctaLink: '/tienda?oferta=true',
    bg: 'from-purple-950 to-indigo-900',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  },
]

export default function HeroSlider() {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[75vh] min-h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative h-full bg-gradient-to-r ${slide.bg} flex items-center`}>
              {/* Background image */}
              <img
                src={slide.img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <span className="text-primary-300 text-sm font-medium uppercase tracking-widest">
                    {slide.subtitle}
                  </span>
                  <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mt-2 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-gray-200 mt-4 text-base md:text-lg leading-relaxed max-w-md">
                    {slide.description}
                  </p>
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 mt-8 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    {slide.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
