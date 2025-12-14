import { useState, useEffect } from "react";

export default function Navbar() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

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
    <nav className="bg-black text-white w-full py-3 px-4 md:px-6 relative">
      {/* TOP ROW */}
      <div className="relative flex items-center justify-center max-w-7xl mx-auto">
        {/* LOGO CENTER */}
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">ODLO</h1>

        {/* CART RIGHT */}
        <div className="hidden lg:block uppercase absolute right-0 text-sm hover:underline cursor-default">
          Cart
        </div>

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

      {/* DESKTOP MENU (CENTER UNDER LOGO) */}
      <div className="hidden lg:flex justify-center mt-2">
        <ul className="flex gap-6 text-sm">
          {/* SERVICES */}
          <li
            className="relative cursor-default group"
            onMouseEnter={() => setHoverMenu("services")}
            onMouseLeave={() => setHoverMenu(null)}
          >
            <span className="hover:underline uppercase py-2 block">Services</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md p-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-600 cursor-pointer">
                  LUXURY LOGO COLLECTIONS
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  BRANDING & IDENTITY PACKS
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  SOCIAL MEDIA KITS
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  POSTERS & PRINTS
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  MOCKUPS
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  3D FASHION ASSETS
                </li>
              </ul>
            </div>
          </li>

          {/* BUNDLES */}
          <li
            className="relative cursor-default group"
            onMouseEnter={() => setHoverMenu("bundles")}
            onMouseLeave={() => setHoverMenu(null)}
          >
            <span className="hover:underline uppercase py-2 block">Bundles</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md p-4 w-[420px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-600 cursor-pointer">
                  Full Branding Studio Bundle
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  Poster Mega Pack
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  3D Accessories Collection
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  Social Media Master Bundle
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  The Luxury Mockup Collection
                </li>
                <li className="hover:text-gray-600 cursor-pointer">
                  All in One Ultimate Bundle
                </li>
              </ul>
            </div>
          </li>

          <li className="cursor-default uppercase hover:underline py-2">
            Privacy Policy
          </li>
          <li className="cursor-default uppercase hover:underline py-2">
            Refund Policy
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
            <div className="mb-8 pb-4 border-b border-gray-800">
              <div className="text-xl hover:underline uppercase cursor-default">
                Cart
              </div>
            </div>

            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index} className="border-b  border-gray-800">
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
                          activeSubMenu === item.name
                            ? "max-h-96"
                            : "max-h-0"
                        }`}
                      >
                        <ul className="pl-4 pb-4 space-y-3 text-sm">
                          {item.submenu.map((sub, i) => (
                            <li key={i} className="text-gray-300">
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-lg">{item.name}</div>
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
