import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart");
        console.log("response:", response);
        setCartItems(response.data.contents || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (item) => {
    await axios.patch(`/api/cart/${item._id}`);
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = async (id) => {
    await axios.delete(`/api/cart/${id}`);
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
