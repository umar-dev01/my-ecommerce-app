const PRODUCTS_CACHE_TTL_MS = 60 * 1000;

let productsCache = null;
let cacheTimestamp = 0;
let inFlightProductsPromise = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
