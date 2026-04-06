import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import Sidebar from "../components/sidebar";
import ProductReviewModal from "../components/ProductReviewModal";
import { getProductsList } from "../utils/productsApi";

function IconHeart() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L5 14.5 12 21l7-6.5 1.8-1.8a5 5 0 0 0 0-7.1Z" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" />
      <path d="M14 4v4M12 6h4" />
    </svg>
  );
}

function IconReview() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H9l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
      <path d="M8 10h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [activeReviewProduct, setActiveReviewProduct] = useState(null);

  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleWishlistClick(e, productId) {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }

  function handleQuickCartClick(e, product) {
    e.stopPropagation();

    if (isProductInCart(product._id)) {
      dispatch({
        type: ACTIONS.REMOVE_ITEM,
        payload: { id: product._id },
      });
      return;
    }

    dispatch({
      type: ACTIONS.ADD_ITEM,
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      },
    });
  }

  // ─── Fetch all products ────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const allProducts = await getProductsList();
        setProducts(allProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ─── Get unique categories from products ─────────────
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return [...new Set(cats)]; // removes duplicates
  }, [products]);

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch) {
      setSearch(querySearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const queryCategory = searchParams.get("category");
    if (!queryCategory) return;

    const matchedCategory = categories.find(
      (category) => category.toLowerCase() === queryCategory.toLowerCase(),
    );

    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
    }
  }, [searchParams, categories]);

  // ─── Check if product is already in cart ─────────────
  const isProductInCart = (productId) => {
    return cart.items.some((item) => item.id === productId);
  };

  // ─── Filter + Sort products ───────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, search, sortBy]);

  // ─── Loading state ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-hpink border-t-transparent"></div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-hpink text-white px-6 py-2 rounded hover:brightness-95 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            All Products
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; Products</p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-8 py-10">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
          />

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="font-lato text-gray-500 text-sm mb-6">
              Showing{" "}
              <span className="font-bold text-hdark">
                {filteredProducts.length}
              </span>{" "}
              products
              {selectedCategory !== "all" && (
                <span className="capitalize"> in "{selectedCategory}"</span>
              )}
              {search && <span> for "{search}"</span>}
            </p>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 font-josefin text-2xl mb-4">
                  No products found
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="text-hpink font-lato hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white group shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  <div
                    className="h-56 bg-hlight flex items-center justify-center p-4 cursor-pointer overflow-hidden relative"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/300x200?text=No+Image";
                      }}
                    />

                    <div className="absolute left-3 top-3 flex items-center gap-3 text-[#2f2f2f] opacity-0 pointer-events-none transition duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleWishlistClick(e, product._id)}
                        className={`transition ${
                          isInWishlist(product._id)
                            ? "text-hpink"
                            : "text-[#2f2f2f] hover:text-hpink"
                        }`}
                        aria-label={
                          isInWishlist(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        title="Wishlist"
                      >
                        <IconHeart />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickCartClick(e, product)}
                        className={`transition ${
                          isProductInCart(product._id)
                            ? "text-hpink"
                            : "text-[#2f2f2f] hover:text-hpink"
                        }`}
                        aria-label={
                          isProductInCart(product._id)
                            ? "Remove from cart"
                            : "Add to cart"
                        }
                        title="Cart"
                      >
                        <IconCart />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReviewProduct(product);
                        }}
                        className="text-[#2f2f2f] transition hover:text-hpink"
                        aria-label="Open reviews"
                        title="Reviews"
                      >
                        <IconReview />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3
                      className="font-josefin font-bold text-hdark text-base mb-1 cursor-pointer hover:text-hpink transition"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {product.name}
                    </h3>

                    <p className="font-lato text-gray-400 text-xs capitalize mb-2">
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-hpink font-bold font-josefin">
                        ${Number(product.price).toFixed(2)}
                      </span>

                      <button
                        onClick={() => {
                          if (isProductInCart(product._id)) {
                            dispatch({
                              type: ACTIONS.REMOVE_ITEM,
                              payload: { id: product._id },
                            });
                          } else {
                            dispatch({
                              type: ACTIONS.ADD_ITEM,
                              payload: {
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                image: product.images?.[0],
                              },
                            });
                          }
                        }}
                        className={`font-josefin text-xs px-4 py-2 transition ${
                          isProductInCart(product._id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-hpink text-white hover:brightness-95"
                        }`}
                      >
                        {isProductInCart(product._id)
                          ? "Remove from Cart"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ProductReviewModal
              product={activeReviewProduct}
              isOpen={Boolean(activeReviewProduct)}
              onClose={() => setActiveReviewProduct(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
