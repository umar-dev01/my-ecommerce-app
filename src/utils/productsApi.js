const PRODUCTS_CACHE_TTL_MS = 60 * 1000;

let productsCache = null;
let cacheTimestamp = 0;
let inFlightProductsPromise = null;

const REVIEW_LIST_ENDPOINTS = [
  (productId) =>
    `${import.meta.env.VITE_API_URL}/api/v1/products/${productId}/reviews`,
  (productId) =>
    `${import.meta.env.VITE_API_URL}/api/v1/reviews?product=${productId}`,
];

const REVIEW_CREATE_ENDPOINTS = [
  (productId) =>
    `${import.meta.env.VITE_API_URL}/api/v1/products/${productId}/reviews`,
  () => `${import.meta.env.VITE_API_URL}/api/v1/reviews`,
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseJsonSafe(response) {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

function normalizeReviewList(payload) {
  const candidates = [
    payload?.data?.reviews,
    payload?.reviews,
    payload?.data?.data?.reviews,
    payload?.data,
  ];

  const reviews = candidates.find(Array.isArray);
  if (!reviews) return [];

  return reviews.map((review) => ({
    id: review?._id || review?.id,
    rating: Number(review?.rating || 0),
    comment: review?.comment || review?.review || "",
    createdAt: review?.createdAt || review?.updatedAt,
    userName:
      review?.user?.name ||
      review?.user?.username ||
      review?.name ||
      "Anonymous",
  }));
}

async function fetchWith429Retry(url, options = {}, retries = 2) {
  const response = await fetch(url, options);

  if (response.status !== 429 || retries <= 0) {
    return response;
  }

  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSeconds = Number(retryAfterHeader);
  const delayMs = Number.isFinite(retryAfterSeconds)
    ? retryAfterSeconds * 1000
    : 700;

  await sleep(delayMs);
  return fetchWith429Retry(url, options, retries - 1);
}

export async function getProductsList({ forceRefresh = false } = {}) {
  const isCacheFresh =
    productsCache && Date.now() - cacheTimestamp < PRODUCTS_CACHE_TTL_MS;

  if (!forceRefresh && isCacheFresh) {
    return productsCache;
  }

  if (inFlightProductsPromise) {
    return inFlightProductsPromise;
  }

  inFlightProductsPromise = (async () => {
    const res = await fetchWith429Retry(
      `${import.meta.env.VITE_API_URL}/api/v1/products`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch products (status ${res.status})`);
    }

    const data = await res.json();
    const list = data?.products || [];

    productsCache = list;
    cacheTimestamp = Date.now();
    return list;
  })();

  try {
    return await inFlightProductsPromise;
  } finally {
    inFlightProductsPromise = null;
  }
}

export async function getProductReviews(productId) {
  if (!productId) return [];

  for (const endpointFactory of REVIEW_LIST_ENDPOINTS) {
    const endpoint = endpointFactory(productId);
    const response = await fetchWith429Retry(endpoint);

    if (response.ok) {
      const payload = await parseJsonSafe(response);
      return normalizeReviewList(payload);
    }

    if (response.status !== 404) {
      const payload = await parseJsonSafe(response);
      throw new Error(
        payload?.message ||
          `Failed to fetch reviews (status ${response.status})`,
      );
    }
  }

  return [];
}

export async function createProductReview({
  productId,
  rating,
  comment,
  token,
}) {
  if (!token) {
    throw new Error("Login required to submit a review");
  }

  for (let index = 0; index < REVIEW_CREATE_ENDPOINTS.length; index += 1) {
    const endpoint = REVIEW_CREATE_ENDPOINTS[index](productId);
    const isProductNestedRoute = index === 0;
    const reviewPayload = isProductNestedRoute
      ? {
          review: comment,
          rating,
        }
      : {
          product: productId,
          review: comment,
          rating,
        };

    const response = await fetchWith429Retry(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewPayload),
    });

    if (response.ok) {
      return parseJsonSafe(response);
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error("Please login to submit a review");
    }

    if (response.status !== 404 && response.status !== 405) {
      const payload = await parseJsonSafe(response);
      throw new Error(
        payload?.message ||
          `Failed to submit review (status ${response.status})`,
      );
    }
  }

  throw new Error("Reviews endpoint not available on this backend");
}
