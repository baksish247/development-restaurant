"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    //console.log(token);

    const verifyToken = async (token) => {
      try {
        const response = await axios.post("/api/verifytoken", { token });
        return response.data.success ? response.data.decoded : null;
      } catch (error) {
        console.error("Token verification error:", error);
        return null;
      }
    };

    if (token) {
      verifyToken(token).then(decoded => {
        if (decoded) {
          setUser(decoded);
        } else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
