import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const CartCounter = createContext({
  cartCount: 0,
  setCartCounter: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCounter] = useState(false);

  useEffect(() =>{
    axios.get('/api/session').then((response) => {
      if (response.ok) {
        // increase cart count by 1 or clear count
      } 
    })
    .catch((error) => {
      console.error("Cannot use if logged out!");
    });
},[])

  return (
    <CartCounter.Provider value={{ setCartCounter }}>
      {children}
    </CartCounter.Provider>
  );
};
