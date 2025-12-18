// src/components/AddToCartButton.js
import { useCart } from "../context/CartContext";
export default function AddToCartButton({ item, type = "service" }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      ...item,
      type: type 
    });
    alert(`${item.title} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-black text-white px-6 py-2 text-sm uppercase hover:bg-gray-800 transition-colors"
    >
      Add to Cart
    </button>
  );
}