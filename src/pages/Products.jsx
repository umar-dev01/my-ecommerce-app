import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Sidebar from "../components/sidebar";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { dispatch, ACTIONS } = useContext(CartContext);
  const navigate = useNavigate();

  // ─── Fetch all products ────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/products`,
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
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
            className="bg-hpink text-white px-6 py-2 rounded hover:bg-pink-700"
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
                    className="h-56 bg-hlight flex items-center justify-center p-4 cursor-pointer overflow-hidden"
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
                        onClick={() =>
                          dispatch({
                            type: ACTIONS.ADD_ITEM,
                            payload: {
                              id: product._id,
                              name: product.name,
                              price: product.price,
                              image: product.images?.[0],
                            },
                          })
                        }
                        className="bg-hdark text-white font-josefin text-xs px-4 py-2 hover:bg-hpurple transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
