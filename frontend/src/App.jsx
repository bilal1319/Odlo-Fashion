import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import Bundles from './pages/Bundles'
import ServicesDetails from './pages/ServicesDetails'
import BundleDetails from './pages/BundlesDetails'
import ScrollToTop from './components/ScrollToTop'
function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/services/:id" element={<ServicesDetails />} />
        <Route path="/bundles/:id" element={<BundleDetails />} />
      </Routes>
    </Router>
  )
}

export default App
