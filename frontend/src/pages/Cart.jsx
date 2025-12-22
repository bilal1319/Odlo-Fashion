import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useEffect } from "react";
import useProductsStore from "../store/productsSrtore";
import useAuthStore from "../store/authStore.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalWithTax,
    syncCartFromLocalStorage, // Add this function to your CartContext
  } = useCart();

  const { user, checkAuth } = useAuthStore();

  const { getAllProducts } = useProductsStore();

  const taxData = getTotalWithTax();

  const navigate = useNavigate();

  useEffect(() => {
    // Fix any old cart items with string prices
    const fixOldCartData = () => {
      try {
        const savedCart = localStorage.getItem("odlo-cart");
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          const needsFix = cart.some((item) => typeof item.price === "string");
          if (needsFix) {
            console.log("Fixing old cart data...");
            const fixedCart = cart.map((item) => ({
              ...item,
              price:
                typeof item.price === "string"
                  ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0
                  : item.price,
            }));
            localStorage.setItem("odlo-cart", JSON.stringify(fixedCart));
            // Instead of reloading, sync the fixed cart with context
            if (syncCartFromLocalStorage) {
              syncCartFromLocalStorage();
            }
          }
        }
      } catch (error) {
        console.error("Error fixing cart data:", error);
      }
    };

    fixOldCartData();

    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "odlo-cart") {
        // When cart changes in localStorage, sync with context
        if (syncCartFromLocalStorage) {
          syncCartFromLocalStorage();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event that we'll trigger when clearing cart
    const handleCartUpdate = () => {
      if (syncCartFromLocalStorage) {
        syncCartFromLocalStorage();
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [syncCartFromLocalStorage]);

  const handleNavigation = async () => {
    if (!user) {
      const res = await checkAuth();
      if (!res.success) {
        toast.error("Please sign in to proceed to checkout.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return;
      }

      if (res.user.role !== "user" && res.user.role !== "admin") {
        toast.error("Please sign in to proceed to checkout.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return;
      }
    }

    navigate("/checkout");
  };

  // Helper to format price for display
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "$0";
    if (typeof price === "number") return `$${price.toFixed(2)}`;
    if (typeof price === "string") {
      if (price.includes("$")) return price;
      return `$${parseFloat(price).toFixed(2)}`;
    }
    return "$0";
  };

  // Enhanced clearCart function
  const handleClearCart = () => {
    clearCart(); // This should update both context and localStorage

    // Trigger custom event to ensure other components in same tab update
    window.dispatchEvent(new Event("cart-updated"));
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto pt-24">
        <h1 className="text-3xl mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/services"
            className="bg-black text-white px-6 py-3 uppercase hover:bg-gray-800 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-3xl mb-8">Your Cart ({cartCount} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items (Scrollable) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="border-b pb-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-32 h-32 object-cover flex-shrink-0 rounded border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&h=200&fit=crop&q=80";
                        }}
                      />

                      {/* Item Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            {item.useCase && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Use Case:</span>{" "}
                                {item.useCase}
                              </p>
                            )}
                            <p className="text-sm mt-2">
                              <span className="font-medium">Type:</span>{" "}
                              {item.type === "product"
                                ? "Product"
                                : item.type === "bundle"
                                ? "Bundle"
                                : item.type === "service"
                                ? "Service"
                                : item.type}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="font-semibold">
                              {formatPrice(item.price)}
                            </p>
                            {item.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.type,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 cursor-pointer flex items-center justify-center border hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.type,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 cursor-pointer flex items-center justify-center border hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="cursor-pointer text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleClearCart}
                  className="cursor-pointer text-red-600 hover:text-red-800 text-sm mt-4"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary (Fixed) */}
<div className="lg:w-1/3">
  <div className="bg-white border rounded-lg p-6 sticky top-24">
    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

    <div className="space-y-3 mb-6">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>${taxData.subtotal.toFixed(2)}</span>
      </div>

      {/* Estimated Tax */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Estimated Tax (23%)</span>
        <span>${taxData.taxAmount.toFixed(2)}</span>
      </div>

      {/* Divider */}
      <div className="border-t pt-3">
        {/* Total with Tax - Prominent */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total (incl. tax)</span>
          <span>${taxData.totalWithTax.toFixed(2)}</span>
        </div>
        
        {/* Optional: Show "Tax included" note */}
        <p className="text-xs text-gray-500 mt-2 text-right">
          Includes ${taxData.taxAmount.toFixed(2)} in taxes
        </p>
      </div>
    </div>

    <div
      onClick={handleNavigation}
      className="bg-black cursor-pointer text-white w-full py-3 uppercase text-center block hover:bg-gray-800 mb-4"
    >
      Proceed to checkout
    </div>

    <Link
      to="/services"
      className="text-center block text-sm text-gray-600 hover:text-black hover:underline"
    >
      Continue Shopping
    </Link>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
