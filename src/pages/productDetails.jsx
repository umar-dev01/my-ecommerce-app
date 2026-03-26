import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
function ProductDetails() {
  const { dispatch, ACTIONS } = useContext(CartContext);
  const { id } = useParams(); // reads id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/products/${id}`,
        );
        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]); // ← runs every time id changes in URL

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">❌ {error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-purple-800 font-bold mb-6 hover:text-pink-600 transition"
        >
          ← Back to Products
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl text-pink-600 font-bold mb-4">
              ${product.price}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <button
              onClick={() =>
                dispatch({
                  type: ACTIONS.ADD_ITEM,
                  payload: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[1],
                  },
                })
              }
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-bold"
            >
              Add to Cart 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
