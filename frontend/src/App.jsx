import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Bundles from './pages/Bundles';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import { CartProvider } from './context/CartContext';
import ServicesDetails from './pages/ServicesDetails';
import BundleDetails from './pages/BundlesDetails';
import ScrollToTop from './components/ScrollToTop';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import useAuthStore from './store/authStore';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Layout />
      </Router>
    </CartProvider>
  );
}

function Layout() {
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  
  // Page reload/refresh pe auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const noNavbarRoutes = ['/signin', '/signup', '/admin/login', '/admin/signup', '/admin/dashboard', '/checkout/success', '/checkout/cancel'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'mt-[65px]' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServicesDetails />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/bundles/:id" element={<BundleDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/signup' element={<AdminSignup />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;