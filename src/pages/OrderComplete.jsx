import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderCompleted() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  // If someone visits directly without placing order → go home
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-purple-100 py-12 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-blue-900 mb-3">
            Order Completed
          </h1>
          <p className="text-gray-600 font-lato text-sm">
            <span className="text-gray-800">Home</span>
            <span className="text-gray-400 mx-2">.</span>
            <span className="text-gray-800">Pages</span>
            <span className="text-gray-400 mx-2">.</span>
            <span className="text-pink-500">Shop Grid Default</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-20">
        <div className="flex items-start justify-center gap-0 max-w-5xl mx-auto">
          {/* Left Section - Clock Icon */}
          <div className="hidden lg:flex flex-col items-center justify-start pt-12 pr-12">
            <img
              src="/public/images/Group.png"
              alt="Clock"
              className="w-24 h-24 object-contain mb-4"
            />
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-96 bg-gray-300"></div>

          {/* Center Section */}
          <div className="flex-1 text-center pl-12">
            {/* Checkmark Icon */}
            <div className="flex justify-center mb-8">
              <img
                src="/public/images/Group (2).png"
                alt="Checkmark"
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="font-josefin text-4xl font-bold text-blue-900 mb-8">
              Your Order Is Completed!
            </h1>

            {/* Message */}
            <p className="text-gray-400 font-lato text-base leading-relaxed mb-10 max-w-2xl mx-auto">
              Thank you for your order! Your order is being processed and will
              be completed within 3-6 hours. You will receive an email
              confirmation when your order is completed.
            </p>

            {/* Continue Shopping Button */}
            <button
              onClick={() => navigate("/products")}
              className="bg-pink-500 text-white font-lato font-bold px-12 py-3 hover:bg-pink-600 transition"
            >
              Continue Shopping
            </button>
          </div>

          {/* Right Section - Clipboard Icon */}
          <div className="hidden lg:flex flex-col items-center justify-start pt-12 pl-12">
            <div className="w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center">
              <img
                src="/public/images/Vector 15 (1).png"
                alt="Clipboard"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Order ID - Below */}
        {orderId && (
          <div className="text-center mt-20">
            <p className="text-gray-500 font-lato text-sm mb-2">Order ID</p>
            <p className="font-josefin text-2xl font-bold text-blue-900">
              #{orderId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCompleted;
