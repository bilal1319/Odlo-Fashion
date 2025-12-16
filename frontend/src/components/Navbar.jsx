import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

export default function Navbar() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const { cartCount } = useCart();

  const menuItems = [
    {
      name: "Services",
      submenu: [
        "LUXURY LOGO COLLECTIONS",
        "BRANDING & IDENTITY PACKS",
        "SOCIAL MEDIA KITS",
        "POSTERS & PRINTS",
        "MOCKUPS",
        "3D FASHION ASSETS",
      ],
    },
    {
      name: "Bundles",
      submenu: [
        "Full Branding Studio Bundle",
        "Poster Mega Pack",
        "3D Accessories Collection",
        "Social Media Master Bundle",
        "The Luxury Mockup Collection",
        "All in One Ultimate Bundle",
      ],
    },
    { name: "Privacy Policy" },
    { name: "Refund Policy" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".hamburger-btn")
      ) {
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

  return (
    <nav className="bg-black text-white w-full py-3 px-4 md:px-6 fixed top-0 left-0 z-50">
      {/* TOP ROW */}
      <div className="relative flex items-center justify-center max-w-7xl mx-auto">
        {/* LOGO CENTER */}
        <Link to="/" className="text-2xl md:text-3xl font-serif font-semibold">
          ODLO
        </Link>

        {/* CART RIGHT with Count Badge */}
        <Link 
          to="/cart" 
          className="hidden lg:flex uppercase absolute right-0 text-sm hover:underline cursor-pointer items-center gap-2"
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
          className="lg:hidden hamburger-btn absolute right-0 flex flex-col space-y-1.5 z-50"
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

      {/* DESKTOP MENU */}
      <div className="hidden lg:flex justify-center mt-2">
        <ul className="flex gap-6 text-sm">
          {/* SERVICES */}
          <li
            className="relative cursor-default group"
            onMouseEnter={() => setHoverMenu("services")}
            onMouseLeave={() => setHoverMenu(null)}
          >
            <Link to="/services" className="hover:underline uppercase py-2 block">
              Services
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md p-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="space-y-2 text-sm">
                {menuItems[0].submenu.map((sub, i) => (
                  <li key={i} className="hover:text-gray-600 cursor-pointer">
                    <Link to={`/services#${sub.toLowerCase().replace(/ & | /g, "-")}`} className="block">
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* BUNDLES */}
          <li
            className="relative cursor-default group"
            onMouseEnter={() => setHoverMenu("bundles")}
            onMouseLeave={() => setHoverMenu(null)}
          >
            <Link to="/bundles" className="hover:underline uppercase py-2 block">
              Bundles
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md p-4 w-[420px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="space-y-2 text-sm">
                {menuItems[1].submenu.map((sub, i) => (
                  <li key={i} className="hover:text-gray-600 cursor-pointer">
                    <Link to="/bundles" className="block">{sub}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li className="cursor-default uppercase hover:underline py-2">
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li className="cursor-default uppercase hover:underline py-2">
            <Link to="/refund-policy">Refund Policy</Link>
          </li>
        </ul>
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
          onClick={() => setIsMobileMenuOpen(false)}
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
                onClick={() => setIsMobileMenuOpen(false)}
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
                        className="flex justify-between items-center w-full py-4 text-left text-lg"
                        onClick={() => toggleSubMenu(item.name)}
                      >
                        {item.name}
                        <span
                          className={`transition-transform ${
                            activeSubMenu === item.name ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all ${
                          activeSubMenu === item.name ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <ul className="pl-4 pb-4 space-y-3 text-sm">
                          {item.submenu.map((sub, i) => (
                            <li key={i} className="text-gray-300 hover:text-white">
                              <Link 
                                to={item.name === "Services" ? "/services" : "/bundles"}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link 
                      to={`/${item.name.toLowerCase().replace(" ", "-")}`}
                      className="py-4 text-lg block"
                      onClick={() => setIsMobileMenuOpen(false)}
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
