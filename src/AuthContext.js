import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() =>{
      axios.get('/api/session').then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
        } 
      })
      .catch((error) => {
        console.error("Not yet signed in");
      });
  },[])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
