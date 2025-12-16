import React from 'react';
import { 
  FaFacebookF, 
  FaYoutube, 
  FaInstagram, 
  FaLinkedinIn, 
  FaPinterestP, 
  FaTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCreditCard
} from 'react-icons/fa';

const Footer = () => {
  const products = [
    "LUXURY LOGO COLLECTIONS",
    "BRANDING & IDENTITY PACKS",
    "SOCIAL MEDIA KITS",
    "POSTERS & PRINTS",
    "MOCKUPS",
    "3D FASHION ASSETS BUNDLE"
  ];

  const bundles = [
    "Full Branding Studio Bundle",
    "Poster Mega Pack",
    "3D Accessories Collection",
    "Social Media Master Bundle",
    "The Luxury Mockup Collection",
    "All in One Ultimate Bundle"
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, label: "Facebook" },
    { icon: <FaYoutube />, label: "YouTube" },
    { icon: <FaInstagram />, label: "Instagram" },
    { icon: <FaLinkedinIn />, label: "LinkedIn" },
    { icon: <FaPinterestP />, label: "Pinterest" },
    { icon: <FaTwitter />, label: "Twitter" }
  ];

  const paymentMethods = [
    { icon: <FaCcVisa />, label: "Visa" },
    { icon: <FaCcMastercard />, label: "Mastercard" },
    { icon: <FaCcAmex />, label: "American Express" },
    { icon: <FaCreditCard />, label: "Union Pay" }
  ];

  return (
    <footer className="bg-white text-black pt-12 pb-8 px-4 mt-10 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column - Products + Follow Us Section */}
          <div>
            <p className='font-bold text-black text-xl    mb-4'>SERVICES</p>
            <ul className="space-y-2">
              {products.map((product, index) => (
                <li key={index} className="hover:text-gray-600 transition-colors">
                  {product}
                </li>
              ))}
            </ul>

            {/* Follow Us Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Bundles */}
          <div>
            <p className='font-bold text-black text-xl    mb-4'>BUNDLES</p>
            <ul className="space-y-2">
              {bundles.map((bundle, index) => (
                <li key={index} className="hover:text-gray-600 transition-colors">
                  {bundle}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Policies and Payment Methods */}
          <div className="flex flex-col justify-between">
            {/* Policies Section - Top */}
            <div className="mb-8">
              <p className='font-bold text-black text-xl    mb-4'>POLICIES</p>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="block text-gray-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="block text-gray-600 hover:text-black transition-colors"
                >
                  Refund Policy
                </a>
              </div>
            </div>

            {/* Payment Methods Section - Bottom */}
            <div>
              <div className="flex space-x-4">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded"
                    aria-label={method.label}
                    title={method.label}
                  >
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
