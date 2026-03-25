import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
function Navbar() {
  const { cart } = useContext(CartContext);
  return (
    <nav className="bg-purple-800 text-white px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-400">
          Hekto
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8">
          <Link to="/" className="hover:text-pink-400 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-pink-400 transition">
            Products
          </Link>
          <Link to="/cart" className="hover:text-pink-400 transition">
            Cart
          </Link>
          <Link to="/login" className="hover:text-pink-400 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
