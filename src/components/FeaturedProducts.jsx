import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import ProductReviewModal from "./ProductReviewModal";
import { getProductsList } from "../utils/productsApi";

const BASE_URL = import.meta.env.VITE_API_URL;
const PRODUCT_FALLBACK_IMAGE = "https://placehold.co/300x250?text=No+Image";

function getSafeProductImage(product) {
  const image = product?.images?.[0];

  if (!image) return PRODUCT_FALLBACK_IMAGE;

  const value =
    typeof image === "string"
      ? image
      : image.url || image.secure_url || image.path || "";

  if (!value) return PRODUCT_FALLBACK_IMAGE;
  if (value.startsWith("http")) return value;
  return `${BASE_URL}${value}`;
}

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

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeReviewProduct, setActiveReviewProduct] = useState(null);
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
      <div className="mx-auto w-full">
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 md:gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100"
            >
              {/* Image Section */}
              <div
                className="h-48 md:h-52 flex items-center justify-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition relative"
                onClick={() => {
                  navigate(`/products/${product._id}`);
                }}
              >
                <img
                  src={getSafeProductImage(product)}
                  alt={product.name}
                  className="h-full object-contain"
                  onError={(e) => {
                    e.target.src = PRODUCT_FALLBACK_IMAGE;
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

              {/* Product Info Section */}
              <div className="p-4 bg-white text-center border-t border-gray-100">
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
                  className={`w-full font-josefin py-2 mt-3 transition text-sm font-semibold ${
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

        <ProductReviewModal
          product={activeReviewProduct}
          isOpen={Boolean(activeReviewProduct)}
          onClose={() => setActiveReviewProduct(null)}
        />

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
