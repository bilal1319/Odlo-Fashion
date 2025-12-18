import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Bundles from './pages/Bundles';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/Cartcontext';
import ServicesDetails from './pages/ServicesDetails';
import BundleDetails from './pages/BundlesDetails';
import ScrollToTop from './components/ScrollToTop';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import useAuthStore from './store/authStore';
import Success from './pages/Sucess';
import useProductsStore from './store/productsSrtore'; // Import products store

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AppInitializer />
        <Layout />
      </Router>
    </CartProvider>
  );
}

// Separate component for initialization logic
function AppInitializer() {
  const { checkAuth } = useAuthStore();
  const { getAllProducts, getCategories } = useProductsStore();
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('App: Initializing...');
        
        // 1. Check authentication
        await checkAuth();
        
        // 2. Pre-fetch products (with built-in caching)
        // This will only fetch if cache is expired or no products exist
        console.log('App: Pre-fetching products...');
        await getAllProducts();
        
        // 3. Pre-fetch categories for navbar
        console.log('App: Pre-fetching categories...');
        await getCategories();
        
        console.log('App: Initialization complete');
      } catch (error) {
        console.error('App: Initialization error:', error);
        // Don't block the app - individual pages will handle their own loading states
      }
    };

    // Start initialization with a small delay to not block initial render
    const initTimer = setTimeout(() => {
      initializeApp();
    }, 300); // 300ms delay - gives time for initial page to render

    return () => clearTimeout(initTimer);
  }, [checkAuth, getAllProducts, getCategories]);

  return null; // This component doesn't render anything
}

function Layout() {
  const location = useLocation();
  const noNavbarRoutes = ['/signin', '/signup'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'mt-[65px]' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:slug" element={<ServicesDetails />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/bundle/:slug" element={<BundleDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/success" element={<Success />} /> */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;