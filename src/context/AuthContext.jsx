import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user data
  async function fetchUserData(currentToken) {
    const tokenToUse = currentToken || token;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/me`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      setUser(data.data.user);
      setError(null);
      
    } catch (err) {
      
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Login function
  async function login(email, password) {
    try {
      setIsLoading(true);
      setError(null);

      

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await res.json();
      const newToken = data.token;

      setToken(newToken);
      localStorage.setItem("token", newToken);

      await fetchUserData(newToken);

      
      return { success: true }; 
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }

  // Register function
  async function register(name, email, password, passwordConfirm) {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            passwordConfirm,
            role: "user",
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      const newToken = data.token;

      setToken(newToken);
      localStorage.setItem("token", newToken);

      await fetchUserData(newToken);

      return { success: true }; 
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message }; 
    } finally {
      setIsLoading(false);
    }
  }

  // Logout function
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setError(null);
  }

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
