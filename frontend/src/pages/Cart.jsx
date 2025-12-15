import { Link } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

export default function Cart() {
  const { 
    cart, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice 
  } = useCart();

  if (cartCount === 0) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">Your Cart</h1>
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
    <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Your Cart ({cartCount} items)</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.type}-${item.id}`} className="border-b pb-6">
              <div className="flex gap-6">
               <img 
  src={item.image} 
  alt={item.title} 
  className="w-32 h-32 object-cover" 
/>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Use Case:</span> {item.useCase}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Type:</span> {item.type === "service" ? "Service" : "Bundle"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border"
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
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Clear Cart
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button className="bg-black text-white w-full py-3 uppercase hover:bg-gray-800 mb-4">
              Proceed to Checkout
            </button>
            
            <Link 
              to="/services" 
              className="text-center block text-sm hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
