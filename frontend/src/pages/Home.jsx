import Carousel from '../components/Carousel';
import ServicesCarousel from "../components/ServicesCarousel";
import BundleCarousel from '../components/BundlesCarousel';
import Footer from "../components/Footer";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";

import img7 from "../assets/img2.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import img10 from "../assets/img10.jpg";
import img11 from "../assets/img11.jpg";
import img12 from "../assets/img12.jpg";

const Home = () => {
  const services = [
    { name: "MOCKUPS", img: img1 },
    { name: "3D FASHION ASSETS", img: img2 },
    { name: "ICON & SYMBOL DESIGN", img: img3 },
    { name: "WEB & APP ASSETS", img: img4 },
    { name: "PROMOTIONAL MATERIALS", img: img5 },
    { name: "PACKAGING DESIGN", img: img6 },
  ];

  const bundles = [
    { name: "Full Branding Studio Bundle", img: img7 },
    { name: "Poster Mega Pack", img: img8 },
    { name: "3D Accessories Collection", img: img9 },
    { name: "Social Media Master Bundle", img: img10 },
    { name: "The Luxury Mockup Collection", img: img11 },
    { name: "All in One Ultimate Bundle", img: img12 },
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Carousel />
     
      <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif font-semibold mb-3 sm:mb-4 md:mb-6 text-center md:text-left">
          Our Services
        </h2>
        <ServicesCarousel services={services} />
        
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center md:text-left">
          Our Bundles
        </h2>
        <BundleCarousel services={bundles} />
      </div>
    </div>
  );
};

export default Home;