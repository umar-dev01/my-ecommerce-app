import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function getImageUrl(path) {
  if (!path) return null;
  const apiBase = import.meta.env.VITE_API_URL || "";

  if (path.startsWith("/images/")) {
    return `${apiBase}${path}`;
  }

  if (apiBase && path.startsWith(`${apiBase}/images/`)) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase}${path}`;
}

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
    }
  }

  return (
    <nav className="bg-white px-12 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
      {/* ── Logo ── */}
      <div className="flex items-center">
        <Link to="/">
          <img src="/images/hekto-logo.png" alt="Hekto Logo" className="h-8" />
        </Link>
      </div>

      {/* ── Navigation Links ── */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-800 hover:text-hpink font-josefin font-medium text-sm transition"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="text-gray-800 hover:text-hpink font-josefin font-medium text-sm transition"
        >
          Products
        </Link>

        {/* My Orders — only show when logged in */}
        {isAuthenticated && (
          <Link
            to="/orders"
            className="text-gray-800 hover:text-hpink font-josefin font-medium text-sm transition"
          >
            My Orders
          </Link>
        )}

        <Link
          to="/cart"
          className="text-gray-800 hover:text-hpink font-josefin font-medium text-sm transition"
        >
          Cart
        </Link>
        <Link
          to="/WishList"
          className="text-gray-800 hover:text-hpink font-josefin font-medium text-sm transition"
        >
          Wish List
        </Link>
      </div>

      {/* ── Search + Actions ── */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-hpink w-44 font-lato"
          />
          <button
            type="submit"
            className="bg-hpink hover:bg-pink-700 text-white px-4 py-2 text-sm transition"
          >
            🔍
          </button>
        </form>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative text-gray-800 hover:text-hpink transition"
        >
          <span className="text-xl">🛒</span>
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-hpink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-josefin">
              {cart.totalItems}
            </span>
          )}
        </Link>

        {/* ── User Menu ── */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Profile Link — clicking name goes to profile */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-hdark hover:text-hpink font-josefin text-sm font-semibold transition"
            >
              {/* Avatar Circle */}
              <div className="w-8 h-8 bg-hdark rounded-full flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <img
                    src={getImageUrl(user.image)}
                    alt={`${user?.name || "User"} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              {user?.name}
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-hpink text-white font-josefin text-sm px-4 py-1 hover:bg-pink-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="font-josefin text-sm font-medium text-hdark hover:text-hpink transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-hpink text-white font-josefin text-sm px-4 py-1 hover:bg-pink-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
