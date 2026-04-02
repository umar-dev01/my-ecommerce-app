import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishListContext";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, isLoading, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { dispatch, ACTIONS } = useContext(CartContext);
  const navigate = useNavigate();

  function handleAddToCart(product) {
    dispatch({
      type: ACTIONS.ADD_ITEM,
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      },
    });
    navigate("/cart");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; Wishlist</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-10">
        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-hpink border-t-transparent"></div>
          </div>
        )}

        {/* Empty Wishlist */}
        {!isLoading && wishlist.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🤍</p>
            <h2 className="font-josefin text-3xl font-bold text-hdark mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 font-lato mb-8">
              Save products you love and come back to them later!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-hpink text-white font-josefin font-semibold px-10 py-3 hover:bg-pink-700 transition"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {!isLoading && wishlist.length > 0 && (
          <>
            {/* Clear All Button */}
            <div className="flex justify-between items-center mb-6">
              <p className="font-josefin text-hdark font-bold">
                {wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved
              </p>
              <button
                onClick={clearWishlist}
                className="text-red-400 hover:text-red-600 font-lato text-sm transition"
              >
                Clear All
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => {
                const product = item.product || item;
                return (
                  <div key={product._id} className="bg-white shadow-sm group">
                    {/* Product Image */}
                    <div
                      className="h-56 bg-hlight flex items-center justify-center p-4 cursor-pointer relative"
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

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // ← stops navigating to details
                          removeFromWishlist(product._id);
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3
                        className="font-josefin font-bold text-hdark text-lg mb-1 cursor-pointer hover:text-hpink transition"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-hpink font-bold font-josefin mb-3">
                        ${Number(product.price).toFixed(2)}
                      </p>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-hdark text-white font-josefin py-2 hover:bg-hpurple transition text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
