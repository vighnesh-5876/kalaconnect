import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerOrders from './pages/seller/Orders';
import SellerProfile from './pages/SellerProfile';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Route guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'seller') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return !user ? children : <Navigate to="/" replace />;
};

const PageLoader = () => (
  <div className="min-h-screen bg-ink-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-ink-600 border-t-gold-500 rounded-full animate-spin" />
      <span className="text-parchment-300/50 text-sm font-sans tracking-widest uppercase">Loading</span>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/seller/:id" element={<SellerProfile />} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-success/:id" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
          <Route path="/seller/products/new" element={<SellerRoute><AddProduct /></SellerRoute>} />
          <Route path="/seller/products/edit/:id" element={<SellerRoute><EditProduct /></SellerRoute>} />
          <Route path="/seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'toast-kaal',
              duration: 3000,
              style: {
                background: '#1a1510',
                border: '1px solid #3e3228',
                color: '#eedcb4',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                borderRadius: '0',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#d4a843', secondary: '#0a0806' },
              },
              error: {
                iconTheme: { primary: '#c9624a', secondary: '#0a0806' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
