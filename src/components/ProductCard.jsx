import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ProductCard({ id, name, price, image }) {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  function handleWishlist() {
    setIsWishlisted(!isWishlisted);
  }

  function handleAddToCart() {
    setIsInCart(true);
    console.log(`Added ${quantity} x ${name} to cart`);
  }
  function handleViewDetails() {
    navigate(`/products/${id}`); // ← ADD THIS
  }
  function handleRemoveFromCart() {
    setIsInCart(false);
    setQuantity(1);
  }
  const formattedPrice = Number(price).toFixed(2);
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded cursor-pointer" // ← added cursor-pointer
        onClick={handleViewDetails}
        onError={(e) => {
          e.target.onError = null; // ← stops the loop immediately
          e.target.src = "https://placehold.co/300x200?text=No+Image";
        }}
      />
      <h3 className="text-xl font-bold mt-2">{name}</h3>
      <p className="text-lg text-pink-600">${formattedPrice}</p>

      <div className="flex justify-between">
        <div className="flex items-center mt-3">
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="bg-gray-200 px-3 py-1 rounded-l"
          >
            -
          </button>
          <span className="bg-gray-100 px-4 py-1">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-200 px-3 py-1 rounded-r"
          >
            +
          </button>
        </div>

        <div className="mt-3">
          <button
            onClick={handleWishlist}
            className="text-l focus:outline-none"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      {!isInCart ? (
        <button
          onClick={handleAddToCart}
          className="bg-pink-600 text-white px-4 py-2 rounded mt-3 w-full hover:bg-pink-700"
        >
          Add to Cart
        </button>
      ) : (
        <button
          onClick={handleRemoveFromCart}
          className="bg-green-600 text-white px-4 py-2 rounded mt-3 w-full hover:bg-green-700"
        >
          ✓ Added (Remove)
        </button>
      )}
    </div>
  );
}

export default ProductCard;
