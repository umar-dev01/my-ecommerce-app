import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // start with true
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((responseData) => {

        // Extract products safely
        let extractedData = null;

        if (responseData?.products && Array.isArray(responseData.products)) {
          extractedData = responseData.products;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          extractedData = responseData.data;
        } else if (Array.isArray(responseData)) {
          extractedData = responseData;
        } else {
          extractedData = responseData; // fallback
        }

        setData(extractedData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return { data, isLoading, error };
}

export default useFetch;
