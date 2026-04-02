import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Fetch wishlist when user logs in ────────────────
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWishlist();
    } else {
      setWishlist([]); // clear when logged out
    }
  }, [isAuthenticated, token]);

  // ─── GET all wishlist items ───────────────────────────
  async function fetchWishlist() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wishlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setWishlist(data.data?.wishlist?.products || []);
    } catch (err) {
      console.error("❌ Wishlist fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // ─── POST add to wishlist ─────────────────────────────
  async function addToWishlist(productId) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wishlist/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to add to wishlist");
      await fetchWishlist(); // refresh wishlist
    } catch (err) {
      console.error("❌ Add to wishlist error:", err);
    }
  }

  // ─── DELETE remove one item ───────────────────────────
  async function removeFromWishlist(productId) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to remove from wishlist");
      await fetchWishlist(); // refresh wishlist
    } catch (err) {
      console.error("❌ Remove from wishlist error:", err);
    }
  }

  // ─── DELETE clear entire wishlist ────────────────────
  async function clearWishlist() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/wishlist`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to clear wishlist");
      setWishlist([]); // clear locally immediately
    } catch (err) {
      console.error("❌ Clear wishlist error:", err);
    }
  }

  // ─── Check if product is in wishlist ─────────────────
  function isInWishlist(productId) {
    return wishlist.some(
      (item) => item._id === productId || item.product?._id === productId,
    );
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
