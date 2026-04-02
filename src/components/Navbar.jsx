import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Container from "./Container";

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
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  }

  function renderUserBadge() {
    return (
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
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <Container className="py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 lg:gap-4">
          <div className="flex items-center shrink-0">
            <Link to="/">
              <img
                src="/images/hekto-logo.png"
                alt="Hekto Logo"
                className="h-8 sm:h-9 w-auto"
              />
            </Link>
          </div>

          <div className="hidden min-[770px]:flex items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-6 xl:gap-8">
              <Link
                to="/"
                className="text-gray-800 hover:text-hpink font-josefin font-medium text-[14px] transition whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-800 hover:text-hpink font-josefin font-medium text-[14px] transition whitespace-nowrap"
              >
                Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="text-gray-800 hover:text-hpink font-josefin font-medium text-[14px] transition whitespace-nowrap"
                >
                  My Orders
                </Link>
              )}
              <Link
                to="/cart"
                className="text-gray-800 hover:text-hpink font-josefin font-medium text-[14px] transition whitespace-nowrap"
              >
                Cart
              </Link>
              <Link
                to="/wishlist"
                className="text-gray-800 hover:text-hpink font-josefin font-medium text-[14px] transition whitespace-nowrap"
              >
                Wish List
              </Link>
            </div>

            <div className="flex items-center gap-4 xl:gap-6">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-40 xl:w-44 rounded-l-md border border-gray-300 px-4 py-2 text-sm font-lato focus:border-hpink focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-hpink px-4 py-2 text-sm text-white transition hover:bg-pink-700"
                >
                  🔍
                </button>
              </form>

              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-hlight hover:text-hpink"
              >
                <span className="text-xl">🛒</span>
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-hpink text-xs font-josefin text-white ring-2 ring-white">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
                  >
                    {renderUserBadge()}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="rounded-md border border-gray-300 px-4 py-2 font-josefin text-sm font-medium text-hdark transition hover:border-hpink hover:text-hpink"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-3 max-[769px]:flex">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-hlight hover:text-hpink"
            >
              <span className="text-xl">🛒</span>
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-hpink text-xs font-josefin text-white ring-2 ring-white">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </Container>

      {isMenuOpen && (
        <Container className="hidden pb-4 max-[769px]:block">
          <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 text-sm font-lato focus:border-hpink focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-md bg-hpink px-4 py-2 text-sm text-white transition hover:bg-pink-700"
              >
                🔍
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-800 transition hover:bg-hlight hover:text-hpink font-josefin font-medium text-sm"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-800 transition hover:bg-hlight hover:text-hpink font-josefin font-medium text-sm"
              >
                Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-gray-800 transition hover:bg-hlight hover:text-hpink font-josefin font-medium text-sm"
                >
                  My Orders
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-800 transition hover:bg-hlight hover:text-hpink font-josefin font-medium text-sm"
              >
                Cart
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-800 transition hover:bg-hlight hover:text-hpink font-josefin font-medium text-sm"
              >
                Wish List
              </Link>
            </div>
            {isAuthenticated ? (
              <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
                >
                  {renderUserBadge()}
                </Link>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-4 border-t border-gray-200 pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 font-josefin text-sm font-medium text-hdark transition hover:border-hpink hover:text-hpink"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </Container>
      )}
    </nav>
  );
}

export default Navbar;
