import React, { createContext, useState, useEffect } from "react";
import axiosInstance, { SetAccessToken } from "../axiosInstance";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    axiosInstance.get("/tokens/refresh").then(({ data }) => {
      SetAccessToken(data.accessToken);
      setUser(data.user);
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
