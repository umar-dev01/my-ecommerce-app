import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createProductReview, getProductReviews } from "../utils/productsApi";

function formatDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function renderStars(rating) {
  const normalized = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = "★".repeat(normalized);
  const emptyStars = "☆".repeat(5 - normalized);
  return `${fullStars}${emptyStars}`;
}

function ProductReviewModal({ product, isOpen, onClose, onReviewSubmitted }) {
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useContext(AuthContext);
  const productId = product?._id || product?.id;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError("");
      const list = await getProductReviews(productId);
      setReviews(list);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!isOpen) return;
    loadReviews();
  }, [isOpen, loadReviews]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce(
      (acc, item) => acc + Number(item.rating || 0),
      0,
    );
    return sum / reviews.length;
  }, [reviews]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      onClose?.();
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review message");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await createProductReview({
        productId,
        rating,
        comment: comment.trim(),
        token,
      });
      setComment("");
      setRating(5);
      await loadReviews();
      onReviewSubmitted?.();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl md:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-josefin text-2xl font-bold text-hdark">
              Reviews for {product?.name || "this product"}
            </h2>
            <p className="mt-1 font-lato text-sm text-gray-500">
              {reviews.length
                ? `${avgRating.toFixed(1)} / 5 · ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                : "No reviews yet. Be the first one."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-3 py-1 text-sm font-semibold text-hdark hover:border-hpink hover:text-hpink"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg border border-gray-200 p-4"
        >
          <p className="mb-2 font-josefin text-sm text-hdark">
            Write your review
          </p>
          <div className="mb-3 flex items-center gap-3">
            <label htmlFor="rating" className="font-lato text-sm text-gray-600">
              Rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              disabled={isSubmitting}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="Share your experience with this product"
            className="w-full rounded border border-gray-300 p-3 text-sm focus:border-hpink focus:outline-none"
            disabled={isSubmitting}
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="font-lato text-xs text-gray-500">
              Posting as {user?.name || "Guest"}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-hpink px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading reviews...</p>
          )}

          {!isLoading && reviews.length === 0 && (
            <p className="text-sm text-gray-500">No reviews available yet.</p>
          )}

          {!isLoading &&
            reviews.map((item) => (
              <div
                key={item.id || `${item.userName}-${item.createdAt}`}
                className="rounded-lg border border-gray-200 p-3"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-josefin font-semibold text-hdark">
                    {item.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <p className="mb-1 text-sm text-hpink">
                  {renderStars(item.rating)}
                </p>
                <p className="font-lato text-sm text-gray-700">
                  {item.comment || "No comment"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductReviewModal;
