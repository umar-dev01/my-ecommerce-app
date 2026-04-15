import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h9.9a1 1 0 0 0 1-.8L21 7H7" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userRole = (user?.role || "").toLowerCase();
  const canManageProducts =
    userRole === "admin" || userRole === "seller" || userRole === "manager";

  const navLinks = [
    { to: "/", label: "Home", protected: false },
    { to: "/products", label: "Products", protected: false },
    { to: "/orders", label: "My Orders", protected: !isAuthenticated },
    {
      to: "/add-product",
      label: "Add Product",
      protected: !(isAuthenticated && canManageProducts),
    },
    { to: "/cart", label: "Cart", protected: false },
    { to: "/wishlist", label: "Wish List", protected: false },
  ].filter((link) => !link.protected);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function handleSearch(event) {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    navigate(`/products?search=${trimmedQuery}`);
    setSearchQuery("");
    setIsMenuOpen(false);
  }

  function isActiveRoute(path) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  }

  function navLinkClass(path, mobile = false) {
    const baseClass = mobile
      ? "rounded-xl px-4 py-3 text-sm font-medium transition"
      : "px-2 py-2 text-[14px] font-medium transition xl:px-3";

    return `${baseClass} font-josefin ${
      isActiveRoute(path)
        ? "text-hpink"
        : "text-gray-800 hover:text-hpink"
    }`;
  }

  function renderUserBadge() {
    return (
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-hdark">
        {user?.image ? (
          <img
            src={getImageUrl(user.image)}
            alt={`${user?.name || "User"} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={isScrolled ? "pb-[72px] lg:pb-[78px]" : ""}>
      <nav
        className={`z-50 border-b border-gray-200 transition-all duration-300 ${
          isScrolled
            ? "fixed left-0 right-0 top-0 bg-white/95 shadow-md backdrop-blur"
            : "relative bg-white"
        }`}
      >
        <Container className="py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="shrink-0">
              <img
                src="/images/hekto-logo.png"
                alt="Hekto Logo"
                className="h-8 w-auto sm:h-9"
              />
            </Link>

            <div className="hidden lg:flex lg:items-center lg:gap-2 xl:gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navLinkClass(link.to)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex lg:items-center lg:gap-3 xl:gap-4">
              <form
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="w-36 px-4 py-2 text-sm font-lato text-gray-700 outline-none xl:w-44"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="flex h-10 w-12 items-center justify-center bg-hpink text-white transition hover:bg-pink-700"
                >
                  <SearchIcon />
                </button>
              </form>

              <Link
                to="/cart"
                aria-label="View cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-800 transition hover:border-hpink hover:bg-hlight hover:text-hpink"
              >
                <CartIcon />
                {cart.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-hpink px-1 text-xs font-josefin text-white ring-2 ring-white">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full border border-gray-200 p-1 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
                >
                  {renderUserBadge()}
                </Link>
              ) : (
                <Link
                to="/login"
                  className="rounded-xl border border-gray-300 px-5 py-2 font-josefin text-sm font-medium text-hdark transition hover:border-hpink hover:text-hpink"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/cart"
                aria-label="View cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-800 transition hover:border-hpink hover:bg-hlight hover:text-hpink"
              >
                <CartIcon />
                {cart.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-hpink px-1 text-xs font-josefin text-white ring-2 ring-white">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
              >
                <MenuIcon open={isMenuOpen} />
              </button>
            </div>
          </div>
        </Container>

        {isMenuOpen && (
          <Container className="pb-4 lg:hidden">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl">
              <form
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden rounded-2xl border border-gray-200"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="min-w-0 flex-1 px-4 py-3 text-sm font-lato text-gray-700 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="flex h-[46px] w-12 items-center justify-center bg-hpink text-white transition hover:bg-pink-700"
                >
                  <SearchIcon />
                </button>
              </form>

              <div className="mt-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={navLinkClass(link.to, true)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-3 text-hdark transition hover:border-hpink hover:bg-hlight hover:text-hpink"
                  >
                    {renderUserBadge()}
                    <span className="font-josefin text-sm font-medium">
                      My Profile
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex rounded-full border border-gray-300 px-5 py-2 font-josefin text-sm font-medium text-hdark transition hover:border-hpink hover:text-hpink"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </Container>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
