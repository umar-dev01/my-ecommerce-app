import { useState, useMemo, useCallback } from "react";

const products = [
  { id: 1, name: "Wireless Headphones", price: 99.99, category: "electronics" },
  { id: 2, name: "Smart Watch", price: 199.99, category: "electronics" },
  { id: 3, name: "Running Shoes", price: 79.99, category: "sports" },
  { id: 4, name: "Yoga Mat", price: 29.99, category: "sports" },
  { id: 5, name: "Coffee Maker", price: 49.99, category: "kitchen" },
  { id: 6, name: "Blender", price: 39.99, category: "kitchen" },
  { id: 7, name: "Camera Lens", price: 299.99, category: "electronics" },
  { id: 8, name: "Bluetooth Speaker", price: 59.99, category: "electronics" },
];

function PerformanceExample() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);
  const handleAddToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);
  // ❌ This runs on EVERY render - even when darkMode changes!
  const filteredProducts = useMemo(() => {
    console.log("🟢1 Filter ran!"); // now only runs when needed
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  console.log("🔴2 Filter ran!"); // watch this in console
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);
  return (
    <div
      className={`min-h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Performance Example
      </h1>

      {/* Cart Summary */}
      <div className="bg-white text-gray-800 p-4 rounded-lg shadow mb-6">
        <p className="font-bold">
          🛒 Cart: {cart.reduce((t, i) => t + i.quantity, 0)} items —
          <span className="text-pink-600"> ${cartTotal.toFixed(2)}</span>
        </p>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-purple-800 text-white px-4 py-2 rounded mb-6 mr-2"
      >
        Toggle Dark Mode
      </button>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-800"
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {["all", "electronics", "sports", "kitchen"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded capitalize ${
              category === cat
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white text-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="font-bold text-purple-800">{product.name}</h3>
            <p className="text-pink-600 font-bold">${product.price}</p>
            <p className="text-gray-500 text-sm capitalize mb-3">
              {product.category}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-pink-600 text-white py-1 rounded hover:bg-pink-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceExample;
