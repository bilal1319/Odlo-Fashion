import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage with price conversion
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('odlo-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
        return parsedCart;
      }
      return [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
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
    try {
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
      localStorage.setItem('odlo-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
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
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          ...item, 
          quantity: 1,
          // Ensure price is stored consistently
          price: item.price || 0
        }];
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
      // removeFromCart(id, type);
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
    localStorage.removeItem('odlo-cart');
  };

  const calculateItemWithTax = (price) => {
    const taxRate = 0.23; 
    return price * (1 + taxRate);
  };

  // FIXED: This function now handles both string and number prices
  const getTotalPrice = () => {
    try {
      return cart.reduce((total, item) => {
        // Handle price safely - it could be string or number
        let price = 0;
        
        if (item.price === undefined || item.price === null) {
          price = 0;
        } else if (typeof item.price === 'string') {
          // If price is a string like "$300", extract the number
          // Remove any non-numeric characters except decimal point
          price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
        } else if (typeof item.price === 'number') {
          // If price is already a number, use it directly
          price = item.price;
        } else {
          console.warn('Unexpected price type:', typeof item.price, item);
          price = 0;
        }
        
        const quantity = item.quantity || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };
  const getTotalWithTax = () => {
  const subtotal = getTotalPrice();
  const taxRate = 0.23; // 23%
  const taxAmount = subtotal * taxRate;
  const totalWithTax = subtotal + taxAmount;
  
  return {
    subtotal: subtotal,
    taxRate: taxRate,
    taxAmount: taxAmount,
    totalWithTax: totalWithTax
  };
};


  // Optional: Add a function to fix old cart data
  const fixCartPrices = () => {
    setCart(prevCart => 
      prevCart.map(item => ({
        ...item,
        // Convert any string prices to numbers
        price: typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0
          : item.price
      }))
    );
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
      fixCartPrices,
      getTotalWithTax,
      calculateItemWithTax
    }}>
      {children}
    </CartContext.Provider>
  );
};