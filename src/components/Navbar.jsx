import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-purple-800 text-white px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-400">
          Hekto
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center">
          <Link to="/" className="hover:text-pink-400 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-pink-400 transition">
            Products
          </Link>
          <Link to="/cart" className="hover:text-pink-400 transition">
            Cart ({cart.totalItems})
          </Link>

          {/* If User is Logged In */}
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              {/* User Info */}
              <div className="flex items-center gap-2 bg-purple-700 px-4 py-2 rounded">
                <span className="text-sm">👤</span>
                <span className="font-semibold">{user?.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            /* If User is NOT Logged In */
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
