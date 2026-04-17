import { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import ProductReviewModal from "../components/ProductReviewModal";
import { deleteProduct, getProductReviews } from "../utils/productsApi";

const BASE_URL = import.meta.env.VITE_API_URL;
const PRODUCT_FALLBACK_IMAGE =
  "https://via.placeholder.com/800x900?text=Product+Image";

function normalizeImageUrl(image) {
  if (!image) return "";
  const value =
    typeof image === "string"
      ? image
      : image.url || image.secure_url || image.path || "";

  if (!value) return "";
  if (value.startsWith("http")) return value;
  return `${BASE_URL}${value}`;
}

function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-hdark"
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

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function formatReviewDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function renderStars(rating) {
  const normalized = Math.max(0, Math.min(5, Number(rating) || 0));
  return `${"★".repeat(normalized)}${"☆".repeat(5 - normalized)}`;
}

function ProductDetails() {
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const productId = product?._id || product?.id || id;
  const productImages = (product?.images || [])
    .map(normalizeImageUrl)
    .filter(Boolean);
  const fallbackImage = PRODUCT_FALLBACK_IMAGE;
  const mainImage = selectedImage || productImages[0] || fallbackImage;
  const cartImage = productImages[0] || fallbackImage;
  const isProductInCart = cart.items.some(
    (item) => String(item.id) === String(productId),
  );
  const inWishlist = isInWishlist(productId);
  const reviewSummary = useMemo(() => {
    if (!reviews.length) {
      return { count: 0, average: 0 };
    }

    const average =
      reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
      reviews.length;

    return { count: reviews.length, average };
  }, [reviews]);
  const isAdmin = useMemo(
    () => (user?.role || "").toLowerCase() === "admin",
    [user?.role],
  );

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

  async function fetchReviews() {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const list = await getProductReviews(productId);
      setReviews(list);
    } catch (err) {
      setReviewsError(err.message || "Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }

  async function handleDeleteProduct() {
    const confirmed = window.confirm(
      `Delete ${product.name}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteProduct({ productId: productId, token });
      navigate("/products");
    } catch (err) {
      setDeleteError(err.message || "Unable to delete product");
    } finally {
      setIsDeleting(false);
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

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId]);

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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-start">
          <div className="order-1 lg:order-1">
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:min-h-[560px] lg:min-h-[680px]">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-[380px] w-auto max-w-full rounded-xl object-contain md:max-h-[520px] lg:max-h-[640px]"
                style={{ imageRendering: "auto" }}
              />
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
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
                        className="h-full w-full object-contain bg-white"
                        loading="lazy"
                      />
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="order-2 lg:order-1">
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

              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  className="rounded-md border border-red-200 bg-red-50 px-5 py-3 font-josefin text-base font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </button>
              ) : null}
            </div>

            {deleteError ? (
              <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
                {deleteError}
              </p>
            ) : null}

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
        </div>

        <div className="mt-10 rounded-3xl border border-[#eceaf8] bg-[#f8f7fd] p-5 md:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-josefin text-sm font-semibold uppercase tracking-[0.25em] text-hpink">
                Reviews
              </p>
              <h2 className="mt-2 font-josefin text-3xl font-bold text-hdark">
                All Reviews About This Product
              </h2>
              <p className="mt-2 font-lato text-sm leading-6 text-[#8a8fb9]">
                {reviewSummary.count
                  ? `${reviewSummary.average.toFixed(1)} average rating from ${reviewSummary.count} customer review${reviewSummary.count > 1 ? "s" : ""}.`
                  : "No reviews yet. Be the first to share your experience."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewsOpen(true)}
              className="self-start rounded-full border border-hpink px-5 py-2 font-josefin text-sm font-semibold text-hpink transition hover:bg-hpink hover:text-white"
            >
              Write a Review
            </button>
          </div>

          {reviewsError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {reviewsError}
            </p>
          )}

          <div className="space-y-4">
            {reviewsLoading && (
              <p className="font-lato text-sm text-[#8a8fb9]">
                Loading reviews...
              </p>
            )}

            {!reviewsLoading && reviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#d9d5f0] bg-white/70 px-5 py-8 text-center">
                <p className="font-josefin text-lg font-semibold text-hdark">
                  No reviews available yet.
                </p>
                <p className="mt-2 font-lato text-sm text-[#8a8fb9]">
                  This product has not received any customer feedback yet.
                </p>
              </div>
            )}

            {!reviewsLoading &&
              reviews.map((review) => (
                <div
                  key={review.id || `${review.userName}-${review.createdAt}`}
                  className="flex gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_6px_20px_rgba(33,24,87,0.05)] md:px-5"
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1effc]">
                    <ReviewIcon />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-josefin text-base font-semibold text-hdark">
                          {review.userName}
                        </p>
                        <p className="font-lato text-xs text-[#8a8fb9]">
                          {formatReviewDate(review.createdAt)}
                        </p>
                      </div>

                      <p className="font-josefin text-sm font-semibold text-hpink">
                        {renderStars(review.rating)}
                      </p>
                    </div>

                    <p className="mt-3 font-lato text-sm leading-7 text-[#7a7f9a]">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <ProductReviewModal
        product={product}
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
}

export default ProductDetails;
