import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        console.log("⚠️ No token available");
        setIsLoading(false);
        return;
      }

      console.log("🔑 Token from context:", token);
      try {
        setIsLoading(true);
        // ✅ FIXED: Use /my-orders endpoint for user orders
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("📡 Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.log("❌ Error response:", errorData);
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await res.json();
        console.log("✅ Orders data:", data);

        // ✅ FIXED: Access orders from data.data.orders
        setOrders(data.data.orders || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-hpink border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">❌ {error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-hpink text-white px-6 py-2 rounded hover:brightness-95 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-josefin text-4xl font-bold text-hdark">
            My Orders
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-white border border-hdark text-hdark px-5 py-2 rounded hover:bg-hlight transition"
          >
            Go Back to Home
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 text-xl mb-6">No orders yet!</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-hpink text-white px-8 py-3 rounded-lg hover:brightness-95 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Order ID</p>
                    <p className="font-mono font-bold text-hdark">
                      #{order._id.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Placed on</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Show number of items */}
                <div className="text-gray-600 text-sm mb-2">
                  {order.orderItems?.length || 0} item(s)
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="font-bold text-xl text-hpink">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="bg-hpink text-white px-6 py-2 rounded hover:brightness-95 transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
