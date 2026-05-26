# ModaPerú — E-commerce de Moda

Plataforma e-commerce completa para tienda de ropa. Construida con React, Node.js, MySQL y Stripe.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, Framer Motion |
| Backend | Node.js, Express, JWT, bcrypt |
| Base de datos | MySQL 8 |
| Pagos | Stripe Checkout + Webhooks, PayPal |
| Deploy | Vercel (frontend) + Hostinger Node.js (backend) |

## Funcionalidades

### Tienda
- Catálogo con filtros por categoría, talla, color y rango de precio
- Ordenamiento por relevancia, precio y valoración
- Búsqueda full-text
- Paginación y scroll infinito
- Galería de imágenes con zoom

### Carrito y checkout
- Carrito persistente (localStorage + base de datos)
- Checkout en 3 pasos: información → envío → pago
- Integración Stripe Checkout con webhooks de confirmación
- Cálculo de envío automático (gratis desde S/ 150)

### Usuarios
- Registro e inicio de sesión con JWT
- Historial de pedidos con seguimiento de estado
- Wishlist
- Direcciones guardadas

### Admin
- Gestión de inventario
- Panel de órdenes

## Estructura del proyecto

```
moda-peru/
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/
│       │   ├── layout/       # Header, Footer, Layout
│       │   ├── home/         # HeroSlider, Categories, TrendingProducts
│       │   ├── catalog/      # ProductCard, ProductFilters
│       │   └── cart/         # CartDrawer
│       ├── pages/            # Home, Catalog, ProductDetail, Cart, Checkout, Account
│       ├── store/            # Zustand: cartStore, authStore
│       └── utils/            # api.js, helpers.js
├── backend/                  # Node.js + Express
│   └── src/
│       ├── routes/           # auth, products, orders, users, webhooks
│       ├── middleware/       # auth, errorHandler
│       └── config/           # database.js
└── database/
    └── schema.sql            # Schema completo + seed inicial
```

## Instalación local

### Requisitos
- Node.js 18+
- MySQL 8+
- Cuenta Stripe (modo test)

### 1. Base de datos

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Variables de entorno

### Backend (`backend/.env`)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=moda_peru

JWT_SECRET=clave_secreta_minimo_32_caracteres

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_USER=tu@email.com
SMTP_PASS=tu_app_password

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Despliegue

### Frontend → Vercel

```bash
cd frontend
npm run build
# Conecta el repo en vercel.com y configura las variables de entorno
```

### Backend → Hostinger (Node.js)

```bash
# En el servidor
npm install --production
pm2 start src/app.js --name moda-peru-api
pm2 save
```

### Base de datos → MySQL Hostinger

Importa `database/schema.sql` desde el panel de control de Hostinger.

## Seguridad

- Contraseñas hasheadas con bcrypt (rounds: 12)
- JWT con expiración de 7 días
- Rate limiting en todas las rutas API
- Helmet.js para headers HTTP seguros
- Validación de input con express-validator
- Transacciones MySQL para operaciones de stock
- Webhook Stripe verificado con firma HMAC

## Pagos con Stripe

Para testing local usa los webhooks de Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Tarjeta de prueba: `4242 4242 4242 4242` · cualquier fecha futura · cualquier CVC

---

Desarrollado por [Taruk](https://taruk.com)
