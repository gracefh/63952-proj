import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
