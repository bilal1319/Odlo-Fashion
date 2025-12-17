import { useCart } from "../context/Cartcontext";

export default function AddToCartButton({ item, type = "product", className = "", quantity = 1, showIcon = false }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Ensure price is a number (not a string with $)
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0
      : item.price || 0;

    const cartItem = {
      id: item._id || item.id,
      title: item.title || item.name,
      description: item.description || item.shortDescription,
      price: price, // Store as number
      image: item.image || item.thumbnail,
      type: type,
      // Include any other relevant fields
      ...(item.categoryId && { categoryId: item.categoryId }),
      ...(item.slug && { slug: item.slug }),
      ...(item.useCase && { useCase: item.useCase }),
      ...(item.originalPrice && { 
        originalPrice: typeof item.originalPrice === 'string'
          ? parseFloat(item.originalPrice.replace(/[^0-9.-]+/g, "")) || 0
          : item.originalPrice 
      })
    };

    addToCart(cartItem);
    
    // Optional: Show feedback
    const itemName = item.title || item.name;
    alert(`${itemName} added to cart!`);
  };

  const buttonClass = className || "bg-black text-white px-6 py-2 text-sm uppercase hover:bg-gray-800 transition-colors";

  // Format price for display
  const displayPrice = typeof item.price === 'string' 
    ? item.price.includes('$') ? item.price : `$${item.price}`
    : `$${item.price || 0}`;

  return (
    <button
      onClick={handleAddToCart}
      className={buttonClass}
    >
      {showIcon ? (
        <>
          <svg 
            className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          ADD TO CART - {displayPrice}
        </>
      ) : (
        `Add to Cart - ${displayPrice}`
      )}
    </button>
  );
}