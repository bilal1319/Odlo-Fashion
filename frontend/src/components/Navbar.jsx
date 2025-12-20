import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import useProductsStore from "../store/productsSrtore";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuthStore();
  
  // Get categories from store
  const { 
    getCategories, 
    categories, 
    isCategoriesLoading 
  } = useProductsStore();

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      await getCategories();
    };
    loadCategories();
  }, [getCategories]);

  // Convert backend category slug to URL hash
  const convertToHash = (categorySlug) => {
    if (!categorySlug) return '';
    return categorySlug.replace(/_/g, '-');
  };

  // Get category name safely
  const getCategoryName = (category) => {
    if (!category) return 'CATEGORY';
    return category.name || 
           (category.slug ? category.slug.replace(/_/g, ' ').toUpperCase() : 'CATEGORY');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      // Navigation will happen automatically due to auth state change
    } catch (error) {
      console.error('Logout failed:', error);
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Menu items with dynamic categories
  const getMenuItems = () => {
    // Default categories in case API fails or is loading
    const defaultCategories = [
      { slug: 'luxury_logo_collections', name: 'LUXURY LOGO COLLECTIONS' },
      { slug: 'branding_identity_packs', name: 'BRANDING & IDENTITY PACKS' },
      { slug: 'social_media_kits', name: 'SOCIAL MEDIA KITS' },
      { slug: 'posters_prints', name: 'POSTERS & PRINTS' },
      { slug: 'mockups', name: 'MOCKUPS' },
      { slug: '3d_fashion_assets', name: '3D FASHION ASSETS' }
    ];

    // Use fetched categories or defaults
    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    return [
      {
        name: "Home",
        to: "/"
      },
      {
        name: "Services",
        to: "/services",
        submenu: displayCategories.map(category => ({
          name: getCategoryName(category),
          to: `/services#${convertToHash(category.slug || category._id)}`
        }))
      },
      {
        name: "Bundles",
        to: "/bundles",
      }
    ];
  };

  const menuItems = getMenuItems();

  // Handle category click
  const handleCategoryClick = () => {
    closeMobileMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".hamburger-btn") &&
        !event.target.closest(".dropdown-toggle") &&
        !event.target.closest(".mobile-dropdown-link")
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveSubMenu(null);
  };

  return (
    <>
      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cancelLogout}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <FiLogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout?</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-black text-white w-full py-4 px-4 md:px-6 fixed top-0 left-0 z-50">
        {/* DESKTOP LAYOUT - Using CSS Grid */}
<div className="hidden lg:grid grid-cols-3 items-center max-w-7xl mx-auto">
  {/* LEFT LOGO */}
  <Link to="/" className="text-lg md:text-xl font-semibold justify-self-start">
    ODLO
  </Link>

  {/* CENTER MENU */}
  <div className="flex justify-center">
    <ul className="flex gap-8 text-sm">
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
              <Link to={item.to} className="uppercase py-2 block relative">
                {item.name}
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            {/* Submenu dropdown */}
          </li>
        ) : (
          // Regular menu items
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

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-6 justify-self-end">
    {/* Cart with Icon and Badge */}
    <Link 
      to="/cart" 
      className="relative p-2 hover:opacity-80 transition-opacity"
      title="Cart"
    >
      <BsCart3 className="text-xl" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
          {cartCount}
        </span>
      )}
    </Link>

    {/* Logout Button */}
    {user && (
      <button
        onClick={handleLogoutClick}
        className="flex items-center gap-2 uppercase text-sm cursor-pointer hover:opacity-80 transition-opacity"
        title="Logout"
      >
        <FiLogOut className="text-lg" />
        <span className="hidden md:inline">Logout</span>
      </button>
    )}
  </div>
</div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden flex items-center justify-between">
          {/* LOGO LEFT */}
          <Link to="/" className="text-lg md:text-xl font-semibold">
            ODLO
          </Link>

          {/* RIGHT SIDE - CART & HAMBURGER */}
          <div className="flex items-center gap-6">
            {/* Mobile Cart with Icon and Badge */}
            <Link 
              to="/cart" 
              className="relative p-2 hover:opacity-80 transition-opacity"
              title="Cart"
            >
              <BsCart3 className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
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
                  className="text-xl hover:underline uppercase flex items-center gap-3 relative"
                  onClick={closeMobileMenu}
                >
                  <BsCart3 className="text-lg" />
                 
                  {cartCount > 0 && (
                    <span className="absolute left-7 top-0 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
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
                          onClick={() => toggleSubMenu(item.name)}
                        >
                          {item.name}
                          <span className="transition-transform duration-300">
                            {activeSubMenu === item.name ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            activeSubMenu === item.name ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          {isCategoriesLoading && item.name === "Services" ? (
                            <div className="pl-4 pb-4 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            <ul className="pl-4 pb-4 space-y-3 text-sm">
                              {item.submenu.map((sub, i) => (
                                <li key={i} className="text-gray-300 hover:text-white">
                                  <Link 
                                    to={sub.to}
                                    className="mobile-dropdown-link block py-1"
                                    onClick={() => {
                                      handleCategoryClick();
                                      closeMobileMenu();
                                    }}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    ) : (
                      <Link 
                        to={item.to}
                        className="py-4 text-lg block hover:text-gray-300 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}

                {/* Mobile Logout Button */}
                {user && (
                  <li className="border-b border-gray-800">
                    <button
                      onClick={handleLogoutClick}
                      className="py-4 text-lg flex items-center gap-3 hover:text-gray-300 transition-colors w-full text-left"
                    >
                      <FiLogOut className="text-base" />
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}