import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import useFetch from "../hooks/useFetch";

function ProductList({ searchQuery }) {
  const {
    data: products,
    isLoading,
    error,
  } = useFetch(`${import.meta.env.VITE_API_URL}/api/v1/products`);
  // State for products
  // const [products, setProducts] = useState([]);

  // State for loading (show spinner)
  // const [isLoading, setIsLoading] = useState(true);

  // State for errors
  // const [error, setError] = useState(null);

  // FETCH products when component loads
  useEffect(() => {
    // Create a function to fetch data
    async function fetchProducts() {
      // try {
      //   // Start loading
      //   setIsLoading(true);
      //   // Clear any old errors
      //   setError(null);
      //   // FETCH from API
      //   const response = await fetch(
      //     `${import.meta.env.VITE_API_URL}/api/v1/products`,
      //   );
      //   // Check if response is OK
      //   if (!response.ok) {
      //     throw new Error("Failed to fetch products");
      //   }
      //   // Convert response to JSON
      //   const data = await response.json();
      //   // Update state with products
      //   setProducts(data.products);
      // } catch (err) {
      //   // Handle any errors
      //   setError(err.message);
      //   console.error("Error fetching:", err);
      // } finally {
      //   // Stop loading (whether success or error)
      //   setIsLoading(false);
      // }
    }

    // Call the function
    fetchProducts();
  }, []); // Empty array = run once when component loads

  // Show LOADING state
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Show ERROR state
  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-xl">❌ Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!products || !Array.isArray(products)) {
    return <div>Loading products...</div>; // or skeleton, or null
  }
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Show PRODUCTS
  return (
    <div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}

export default ProductList;
