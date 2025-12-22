// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
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
import ServicesManagement from './pages/ServicesManagement';
import BundlesManagement from './pages/BundlesManagement';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import useAuthStore from './store/authStore';
import useProductsStore from './store/productsSrtore';
import AdminLayout from './components/AdminLayout';
import UserAuthWrapper from './components/UserAuthWrapper';
import VerifyEmail from './pages/VerifyEmail';


function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AppInitializer />
        {/* Add ToastContainer component here */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            zIndex: 9999,
          }}
        />
        <Layout />
      </Router>
    </CartProvider>
  );
}

function AppInitializer() {
  const { checkAuth } = useAuthStore();
  const { getAllProducts, getCategories } = useProductsStore();
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('App: Initializing...');
        await checkAuth();
        console.log('App: Pre-fetching products...');
        await getAllProducts();
        console.log('App: Pre-fetching categories...');
        await getCategories();
        console.log('App: Initialization complete');
      } catch (error) {
        console.error('App: Initialization error:', error);
      }
    };

    const initTimer = setTimeout(() => {
      initializeApp();
    }, 300);

    return () => clearTimeout(initTimer);
  }, [checkAuth, getAllProducts, getCategories]);

  return null;
}

function Layout() {
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const noNavbarRoutes = [
    '/signin', '/signup', 
    '/admin/login', '/admin/signup',
    '/checkout/success', '/checkout/cancel',
    '/admin','/admin/service','/admin/bundle'
  ];
  const showNavbar = !noNavbarRoutes.includes(location.pathname) && 
                     !location.pathname.startsWith('/admin/');

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'mt-[65px]' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:slug" element={<ServicesDetails />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/bundle/:slug" element={<BundleDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<UserAuthWrapper><Checkout /></UserAuthWrapper>} />
          <Route path="/checkout/success" element={<UserAuthWrapper><CheckoutSuccess /></UserAuthWrapper>} />
          <Route path="/checkout/cancel" element={<UserAuthWrapper><CheckoutCancel /></UserAuthWrapper>} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verify' element={<VerifyEmail />} />
          
          {/* Admin Auth Routes (without layout) */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/signup' element={<AdminSignup />} />
          
          {/* Admin Routes with Sidebar Layout */}
          
          <Route path="/admin" element={<AdminLayout />}>
 
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="service" element={<ServicesManagement />} />
            <Route path="bundle" element={<BundlesManagement />} />

          </Route>
          
        </Routes>
      </div>
    </div>
  );
}

export default App;