import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage with price conversion
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('odlo-cart');
    if (!savedCart) return [];
    
    try {
      const parsedCart = JSON.parse(savedCart);
      // Convert any string prices to numbers when loading from localStorage
      return parsedCart.map(item => ({
        ...item,
        price: parsePriceToNumber(item.price)
      }));
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  const [cartCount, setCartCount] = useState(0);

  // Helper function to parse price to number
  const parsePriceToNumber = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove currency symbols, commas, and other non-numeric characters
      const cleaned = price.replace(/[^0-9.-]+/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Update cart count and save to localStorage whenever cart changes
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
    
    // Save to localStorage
    try {
      localStorage.setItem('odlo-cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      // Ensure price is stored as a number
      const itemToAdd = {
        ...item,
        price: parsePriceToNumber(item.price),
        quantity: 1
      };

      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { 
                ...cartItem, 
                quantity: cartItem.quantity + 1 
              }
            : cartItem
        );
      } else {
        return [...prevCart, itemToAdd];
      }
    });
  };

  const removeFromCart = (id, type) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === id && item.type === type)
    ));
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, type);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity: Math.floor(quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0; // Now price is already a number
      return total + (price * item.quantity);
    }, 0);
  };

  // Helper function to get formatted price (for display)
  const getFormattedPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return '$0.00';
  };

  // Helper to get item subtotal
  const getItemSubtotal = (item) => {
    const price = item.price || 0;
    return price * item.quantity;
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getFormattedPrice,
      getItemSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};