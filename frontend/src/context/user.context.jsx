import React, { createContext, useContext, useState,useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

    useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    console.log("Restoring user from localStorage:", parsed);
    setUser(parsed);
  }
}, []);



  // You can add login, logout, and update functions here
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
//export const useUser = () =>

