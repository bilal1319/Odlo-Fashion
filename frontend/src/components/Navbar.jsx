import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Navbar() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const { cartCount } = useCart();

  const menuItems = [
    {
      name: "Home",
      to: "/"
    },
    {
      name: "Services",
      to: "/services",
      submenu: [
        { name: "LUXURY LOGO COLLECTIONS", to: "/services#luxury-logo-collections" },
        { name: "BRANDING & IDENTITY PACKS", to: "/services#branding-identity-packs" },
        { name: "SOCIAL MEDIA KITS", to: "/services#social-media-kits" },
        { name: "POSTERS & PRINTS", to: "/services#posters-prints" },
        { name: "MOCKUPS", to: "/services#mockups" },
        { name: "3D FASHION ASSETS", to: "/services#3d-fashion-assets" },
      ],
    },
    {
      name: "Bundles",
      to: "/bundles",
      submenu: [
        { name: "Full Branding Studio Bundle", to: "/bundles" },
        { name: "Poster Mega Pack", to: "/bundles" },
        { name: "3D Accessories Collection", to: "/bundles" },
        { name: "Social Media Master Bundle", to: "/bundles" },
        { name: "The Luxury Mockup Collection", to: "/bundles" },
        { name: "All in One Ultimate Bundle", to: "/bundles" },
      ],
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside mobile menu container or hamburger button
      const isInsideMobileMenu = event.target.closest(".mobile-menu-container");
      const isHamburgerBtn = event.target.closest(".hamburger-btn");
      const isDropdownToggle = event.target.closest(".dropdown-toggle");
      const isChevronIcon = event.target.closest(".chevron-icon") || 
                            event.target.closest("svg") || 
                            event.target.closest("path");
      
      // Don't close if clicking inside mobile menu, hamburger, dropdown toggle, or chevron icon
      if (!isInsideMobileMenu && !isHamburgerBtn && !isDropdownToggle && !isChevronIcon) {
        setIsMobileMenuOpen(false);
        setActiveSubMenu(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleSubMenu = (menuName) => {
    setActiveSubMenu(activeSubMenu === menuName ? null : menuName);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveSubMenu(null);
  };

  return (
    <nav className="bg-black text-white w-full py-4 px-4 md:px-6 fixed top-0 left-0 z-50">
      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto">
        {/* LOGO LEFT */}
        <Link to="/" className="text-lg md:text-xl font-semibold">
          ODLO
        </Link>

        {/* CENTER MENU LINKS */}
        <div className="flex justify-center">
          <ul className="flex gap-6 text-sm">
            {menuItems.map((item, index) => (
              item.submenu ? (
                // Items with submenus (Services, Bundles)
                <li
                  key={index}
                  className="relative cursor-default group"
                  onMouseEnter={() => setHoverMenu(item.name.toLowerCase())}
                  onMouseLeave={() => setHoverMenu(null)}
                >
                  <div className="relative">
                    <Link to={item.to} className=" uppercase py-2 block relative">
                      {item.name}
                      <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    style={{ width: item.name === "Bundles" ? "420px" : "264px" }}
                  >
                    <ul className="space-y-2 text-sm">
                      {item.submenu.map((sub, i) => (
                        <li key={i} className="hover:text-gray-600 cursor-pointer">
                          <Link to={sub.to} className="block">
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                // Regular menu items (Home, Privacy Policy, Refund Policy)
                <li key={index} className="relative cursor-default group">
                  <Link to={item.to} className="uppercase py-2 block relative">
                    {item.name}
                    <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>

        {/* CART RIGHT with Count Badge */}
        <Link 
          to="/cart" 
          className="uppercase text-sm cursor-pointer items-center gap-2 flex"
        >
          Cart
          {cartCount > 0 && (
            <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden flex items-center justify-between">
        {/* LOGO LEFT */}
        <Link to="/" className="text-lg md:text-xl font-semibold">
          ODLO
        </Link>

        {/* RIGHT SIDE - CART & HAMBURGER */}
        <div className="flex items-center gap-4">
          {/* Mobile Cart */}
          <Link 
            to="/cart" 
            className="text-sm uppercase flex items-center gap-2"
          >
            Cart
            {cartCount > 0 && (
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* HAMBURGER (MOBILE) */}
          <button
            className="hamburger-btn flex flex-col space-y-1.5 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden mobile-menu-container fixed inset-0 z-40 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        ></div>

        <div
          className={`absolute right-0 top-0 h-full w-80 bg-black shadow-2xl transform transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-20 px-6">
            {/* Mobile Cart */}
            <div className="mb-8 pb-4 border-b border-gray-800">
              <Link 
                to="/cart" 
                className="text-xl hover:underline uppercase flex items-center gap-3"
                onClick={closeMobileMenu}
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index} className="border-b border-gray-800">
                  {item.submenu ? (
                    <>
                      <button
                        className="flex justify-between items-center w-full py-4 text-left text-lg dropdown-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubMenu(item.name);
                        }}
                      >
                        {item.name}
                        <span className="transition-transform duration-300">
                          {activeSubMenu === item.name ? (
                            <FiChevronUp className="w-4 h-4 chevron-icon" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 chevron-icon" />
                          )}
                        </span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeSubMenu === item.name ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <ul className="pl-4 pb-4 space-y-3 text-sm">
                          {item.submenu.map((sub, i) => (
                            <li key={i} className="text-gray-300 hover:text-white">
                              <Link 
                                to={sub.to}
                                className="mobile-dropdown-link"
                                onClick={closeMobileMenu}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link 
                      to={item.to}
                      className="py-4 text-lg block"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}