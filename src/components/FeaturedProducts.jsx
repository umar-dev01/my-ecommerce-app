import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import { getProductsList } from "../utils/productsApi";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

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

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await getProductsList();
        setProducts(allProducts.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalSlides = Math.ceil(products.length / 4);

  // Check if product is already in cart
  const isProductInCart = (productId) => {
    return cart.items.some((item) => item.id === productId);
  };

  return (
    <section className="py-16 px-8 bg-white">
      <div className="container mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? "bg-gray-400" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>

          <h2 className="font-josefin text-5xl font-bold text-blue-900 mb-4">
            Featured Products
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100"
            >
              {/* Image Section */}
              <div
                className="h-64 flex items-center justify-center p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition relative"
                onClick={() => {
                  navigate(`/products/${product._id}`);
                }}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x250?text=No+Image";
                  }}
                />

                <button
                  type="button"
                  onClick={(e) => handleWishlistClick(e, product._id)}
                  className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 text-base shadow-sm transition duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto ${
                    isInWishlist(product._id)
                      ? "border-hpink text-hpink"
                      : "border-gray-200 text-hdark/70 hover:border-hpink hover:text-hpink"
                  }`}
                  aria-label={
                    isInWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isInWishlist(product._id) ? "♥" : "♡"}
                </button>
              </div>

              {/* Product Info Section */}
              <div className="p-6 bg-white text-center border-t border-gray-100">
                {/* Product Name in Pink */}
                <h3
                  onClick={() => {
                    navigate(`/products/${product._id}`);
                  }}
                  className="font-josefin font-bold text-pink-500 text-lg mb-2 cursor-pointer hover:text-pink-600 transition"
                >
                  {product.name}
                </h3>

                {/* Product Code */}
                <p className="text-gray-600 text-sm mb-3">
                  Code - {product.sku || "Y523201"}
                </p>

                {/* Price in Dark Color */}
                <p className="text-gray-800 font-bold text-lg">
                  ${Number(product.price).toFixed(2)}
                </p>

                {/* Add to Cart Button */}
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
                  className={`w-full font-josefin py-2 mt-4 transition text-sm font-semibold ${
                    isProductInCart(product._id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-pink-500 text-white hover:bg-pink-700"
                  }`}
                >
                  {isProductInCart(product._id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="border-2 border-pink-500 text-pink-500 font-josefin font-semibold px-12 py-3 hover:bg-pink-500 hover:text-white transition"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
export default FeaturedProducts;
