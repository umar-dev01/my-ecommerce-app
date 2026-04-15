import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishListContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cart from "../pages/Cart";

const PRODUCT_CARD_FALLBACK_IMAGE =
  "https://placehold.co/300x200?text=No+Image";

function getSafeProductCardImage(image) {
  return typeof image === "string" && image.trim()
    ? image
    : PRODUCT_CARD_FALLBACK_IMAGE;
}

function ProductCard({ id, name, price, image }) {
  const { dispatch, ACTIONS } = useContext(CartContext);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(id);
  const navigate = useNavigate();
  function handleWishlist() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  }

  function handleAddToCart() {
    dispatch({
      type: ACTIONS.ADD_ITEM,
      payload: { id, name, price, image: getSafeProductCardImage(image) },
    });
    console.log(`Added ${name} to cart`);
  }
  function handleViewDetails() {
    navigate(`/products/${id}`); // ← ADD THIS
  }
  const formatedPrice = Number(price).toFixed(2);
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img
        src={getSafeProductCardImage(image)}
        alt={name}
        className="w-full h-48 object-cover rounded cursor-pointer" // ← added cursor-pointer
        onClick={handleViewDetails}
        onError={(e) => {
          e.target.onError = null; // ← stops the loop immediately
          e.target.src = PRODUCT_CARD_FALLBACK_IMAGE;
        }}
      />
      <h3 className="text-xl font-bold mt-2">{name}</h3>
      <p className="text-lg text-pink-600">${formatedPrice}</p>

      <div className="flex justify-between">
        <div className="flex items-center mt-3">
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="bg-gray-200 px-3 py-1 rounded-l"
          >
            -
          </button>
          <span className="bg-gray-100 px-4 py-1">{Cart.quantity}</span>
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
            className="text-xl focus:outline-none"
          >
            {inWishlist ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-pink-600 text-white px-4 py-2 rounded mt-3 w-full hover:bg-pink-700"
      >
        Add to Cart 🛒
      </button>
    </div>
  );
}

export default ProductCard;
