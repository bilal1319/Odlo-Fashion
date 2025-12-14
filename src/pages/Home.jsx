import Navbar from "../components/Navbar";
import Carousel from '../components/Carousel'
import ServicesCarousel from "../components/ServicesCarousel";
import BundleCarousel from "../components/BundlesCarousel";
import Footer from "../components/Footer";
const Home = () => {
  const services = [
    { name: "MOCKUPS", img: "/img5.jpg" },
    { name: "3D FASHION ASSETS", img: "/img6.jpg" },
    { name: "ICON & SYMBOL DESIGN", img: "/img7.jpg" },
    { name: "WEB & APP ASSETS", img: "/img8.jpg" },
    { name: "PROMOTIONAL MATERIALS", img: "/img9.jpg" },
    { name: "PACKAGING DESIGN", img: "/img10.jpg" },
  ];
  const bundles = [
     { name: "Full Branding Studio Bundle", img: "/img11.jpg" },
    { name: "Poster Mega Pack", img: "/img12.jpg" },
    { name: "3D Accessories Collection", img: "/img13.jpg" },
    { name: "Social Media Master Bundle", img: "/img14.jpg" },
    { name: "The Luxury Mockup Collection", img: "/img15.jpg" },
    { name: "All in One Ultimate Bundle", img: "/img16.jpg" },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
            <Carousel />

     
      <div className="mt-10 px-8">
        <h2 className="text-3xl font-semibold font-serif mb-6">Our Services</h2>
        <ServicesCarousel services={services} />
                <h2 className="text-3xl font-bold mb-6">Our Bundles</h2>
        < BundleCarousel services={bundles} />

      </div>
      <Footer/>
    </div>

  );
};

export default Home;
