import { createContext, useState, useEffect } from "react";
import { getUserProfile } from "./api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);  // Track loading state

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      // console.log("User set, navigating to /calendar...");
      navigate("/calendar");
    }
  }, [user]);

  // console.log("Retrieved token from localStorage:", token);

  useEffect(() => {
    if (token) {
      // console.log("Fetching user profile with token:", token); // Debugging token use
      getUserProfile(token)
        .then((userData)=> {
          // console.log("User data retrieved:", userData); // Check if user data is coming
          setUser(userData);
        })
        .catch((error) => {
          // console.error("Error fetching profile:", error.message);
          if (error.message.includes("401") || error.message.includes("Invalid token")) {
            logout();
          }
        })
        .finally(() => {
          setLoading(false); // Stop loading once API call is complete
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // console.log(" User state changed:", user);
  }, [user]);

  const login = (token) => {
    // console.log("Storing token in localStorage:", token); // Ensure token is stored
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    // console.log("Logging out, removing token.");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
