import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";

function normalizeImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.path || "";
}

function ProductDetails() {
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const productId = product?._id || product?.id || id;
  const productImages = (product?.images || [])
    .map(normalizeImageUrl)
    .filter(Boolean);
  const fallbackImage =
    "https://via.placeholder.com/800x900?text=Product+Image";
  const mainImage = selectedImage || productImages[0] || fallbackImage;
  const cartImage = productImages[0] || fallbackImage;
  const isProductInCart = cart.items.some(
    (item) => String(item.id) === String(productId),
  );
  const inWishlist = isInWishlist(productId);

  function handleWishlistClick() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/products/${id}`,
        );
        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        const nextProduct =
          data?.data?.product || data?.product || data?.data || data;

        if (!nextProduct || typeof nextProduct !== "object") {
          throw new Error("Invalid product data");
        }

        setProduct(nextProduct);
        const firstImage = normalizeImageUrl(nextProduct.images?.[0]);
        setSelectedImage(firstImage || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-hpink border-t-transparent"></div>
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
            className="bg-hpink text-white px-6 py-2 rounded hover:brightness-95 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-4 shadow-sm md:p-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm font-bold text-hdark transition hover:text-hpink"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
              {(productImages.length ? productImages : [fallbackImage]).map(
                (image, index) => {
                  const isActive = image === mainImage;
                  return (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`h-24 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${
                        isActive
                          ? "border-hpink"
                          : "border-transparent hover:border-hdark/30"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                },
              )}
            </div>

            <h1 className="mb-2 text-4xl font-josefin font-bold text-hdark">
              {product.name}
            </h1>
            <p className="mb-3 font-lato text-sm text-hpink">★★★★★ (22)</p>
            <div className="mb-4 flex items-center gap-3">
              <p className="font-josefin text-hdark/70 line-through">
                ${(Number(product.price) * 1.35).toFixed(2)}
              </p>
              <p className="font-josefin text-2xl font-bold text-hdark">
                ${Number(product.price || 0).toFixed(2)}
              </p>
            </div>

            <h2 className="mb-2 text-2xl font-josefin font-semibold text-hdark">
              Color
            </h2>
            <p className="mb-7 max-w-xl font-lato leading-8 text-[#8a8fb9]">
              {product.description ||
                "No description added yet for this product."}
            </p>

            <div className="mb-10 flex items-center gap-5">
              <button
                onClick={() => {
                  if (isProductInCart) {
                    dispatch({
                      type: ACTIONS.REMOVE_ITEM,
                      payload: { id: productId },
                    });
                    return;
                  }

                  dispatch({
                    type: ACTIONS.ADD_ITEM,
                    payload: {
                      id: productId,
                      name: product.name,
                      price: product.price,
                      image: cartImage,
                    },
                  });
                }}
                className={`rounded-md px-7 py-3 font-josefin text-base font-semibold transition ${
                  isProductInCart
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-hdark text-white hover:brightness-110"
                }`}
              >
                {isProductInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm transition ${
                  inWishlist
                    ? "border-hpink text-hpink"
                    : "border-gray-200 text-hdark/70 hover:border-hpink hover:text-hpink"
                }`}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {inWishlist ? "♥" : "♡"}
              </button>
            </div>

            <div className="space-y-3 font-josefin text-hdark">
              <p>
                <span className="font-semibold">Categories:</span>{" "}
                {product.category || "General"}
              </p>
              <p>
                <span className="font-semibold">Tags:</span>{" "}
                {Array.isArray(product.tags) && product.tags.length
                  ? product.tags.join(", ")
                  : "New Arrival"}
              </p>
              <p>
                <span className="font-semibold">Share:</span> Facebook •
                Instagram • Twitter
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-lg bg-[#f6f7fb] p-3">
              <img
                src={mainImage}
                alt={product.name}
                className="h-[320px] w-full rounded-md object-cover md:h-[520px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
