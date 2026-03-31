import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

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
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/public/images/hekto-logo.png"
          alt="Hekto Logo"
          className="h-8"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Home
        </Link>
        <Link
          to="/"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Pages
        </Link>
        <Link
          to="/products"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Products
        </Link>
        <Link
          to="/"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Blog
        </Link>
        <Link
          to="/Cart"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Cart
        </Link>
        <Link
          to="/"
          className="text-gray-800 hover:text-purple-600 font-medium text-sm"
        >
          Contact
        </Link>
      </div>

      {/* Search Bar & User Actions */}
      <div className="flex items-center gap-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-48"
          />
          <button
            type="submit"
            className="ml-0 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-sm font-medium text-sm"
          >
            🔍
          </button>
        </form>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative text-gray-800 hover:text-purple-600"
        >
          <span className="text-lg">🛒</span>
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.totalItems}
            </span>
          )}
        </Link>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-700 text-sm">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-800 hover:text-purple-600 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-800 hover:text-purple-600 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-800 hover:text-purple-600 text-sm font-medium"
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
