import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!token) {
        console.log("⚠️ No token available");
        setError("Please login to view order details");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Fetching order:", id);
        console.log("🔑 Token:", token);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`,
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
          throw new Error(errorData.message || "Order not found");
        }

        const data = await res.json();
        console.log("✅ Full response:", data);
        console.log("✅ Order data:", data.data.order);

        setOrder(data.data.order);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [id, token]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
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
            onClick={() => navigate("/orders")}
            className="bg-purple-800 text-white px-6 py-2 rounded hover:bg-purple-900 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // No order data
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-xl mb-4">No order found</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-purple-800 text-white px-6 py-2 rounded hover:bg-purple-900 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="text-purple-800 font-bold mb-6 hover:text-pink-600 transition"
        >
          ← Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-mono font-bold text-purple-800 text-lg">
                #{order._id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Placed on</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 pt-4 border-t">
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
              ${
                order.orderStatus === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.orderStatus === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {(order.orderStatus || "pending").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-josefin text-2xl font-bold text-purple-800 mb-4">
            Items ({order.orderItems?.length || 0})
          </h2>

          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-pink-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No items in this order
            </p>
          )}

          {/* Total */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Total</p>
              <p className="font-bold text-2xl text-pink-600">
                ${order.totalPrice?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-josefin text-2xl font-bold text-purple-800 mb-4">
            Shipping Address
          </h2>
          {order.shippingAddress ? (
            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-semibold">Address:</span>{" "}
                {order.shippingAddress.address}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">City:</span>{" "}
                {order.shippingAddress.city}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Postal Code:</span>{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Country:</span>{" "}
                {order.shippingAddress.country}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Phone:</span>{" "}
                {order.shippingAddress.phone}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No shipping address available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
