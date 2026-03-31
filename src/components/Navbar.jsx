import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";
function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="px-20 py-2 flex items-center justify-around">
      <div className="flex item-center">
        <div class="img">
          <img src="/public/images/hekto-logo.png" alt="" />
        </div>
        <div className="flex item-center justify-center px-12">
          <Link class="link-hover" to="/">
            Home
          </Link>
          <Link class="link-hover" to="/products" className="">
            Products
          </Link>
          <Link class="link-hover" to="/cart" className="">
            Cart ({cart.totalItems})
          </Link>

          {/* If User is Logged In */}
          {isAuthenticated ? (
            <div className="">
              {/* User Info */}
              <div className="">
                <span className="">👤</span>
                <span className="">{user?.name}</span>
              </div>

              {/* Logout Button */}
              <button onClick={handleLogout} className="">
                Logout
              </button>
            </div>
          ) : (
            /* If User is NOT Logged In */
            <div className="m-auto ">
              <Link class="link-hover" to="/login" className="">
                Login
              </Link>
              <Link to="/register" className="">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="w-10 mr-24">
        <SearchBar />
      </div>
    </nav>
  );
}

export default Navbar;
