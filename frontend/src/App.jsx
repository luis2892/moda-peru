import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderConfirmation from './pages/OrderConfirmation'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tienda" element={<Catalog />} />
        <Route path="tienda/:categoria" element={<Catalog />} />
        <Route path="producto/:slug" element={<ProductDetail />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="cuenta" element={<Account />} />
        <Route path="confirmacion/:orderId" element={<OrderConfirmation />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
