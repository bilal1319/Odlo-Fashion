import { Link } from "react-router-dom";
import { useCart } from "../context/Cartcontext";
import { useEffect } from "react";
import useProductsStore from "../store/productsSrtore";

export default function Cart() {
  const { 
    cart, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice 
  } = useCart();

  const { getAllProducts } = useProductsStore();

useEffect(() => {
  // Fix any old cart items with string prices
  const fixOldCartData = () => {
    try {
      const savedCart = localStorage.getItem('odlo-cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const needsFix = cart.some(item => typeof item.price === 'string');
        if (needsFix) {
          console.log('Fixing old cart data...');
          const fixedCart = cart.map(item => ({
            ...item,
            price: typeof item.price === 'string' 
              ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0
              : item.price
          }));
          localStorage.setItem('odlo-cart', JSON.stringify(fixedCart));
          window.location.reload(); // Reload to use fixed data
        }
      }
    } catch (error) {
      console.error('Error fixing cart data:', error);
    }
  };
  
  fixOldCartData();
}, []);

  // Helper to format price for display
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '$0';
    if (typeof price === 'number') return `$${price}`;
    if (typeof price === 'string') {
      if (price.includes('$')) return price;
      return `$${price}`;
    }
    return '$0';
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
                  <div key={`${item.type}-${item.id}`} className="border-b pb-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      {/* Image */}
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-32 h-32 object-cover flex-shrink-0 rounded border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&h=200&fit=crop&q=80";
                        }}
                      />

                      {/* Item Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            {item.useCase && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Use Case:</span> {item.useCase}
                              </p>
                            )}
                            <p className="text-sm mt-2">
                              <span className="font-medium">Type:</span> {item.type === "product" ? "Product" : 
                                                                         item.type === "bundle" ? "Bundle" : 
                                                                         item.type === "service" ? "Service" : 
                                                                         item.type}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="font-semibold">{formatPrice(item.price)}</p>
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
                              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm mt-4"
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
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="bg-black text-white w-full py-3 uppercase text-center block hover:bg-gray-800 mb-4"
              >
                Proceed to checkout
              </Link>
              
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