import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
  
  const noNavbarRoutes = ['/signin', '/signup'];
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
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;