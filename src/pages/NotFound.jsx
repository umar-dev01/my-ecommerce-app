import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-purple-800 mb-4">404</h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-700 mb-4">
          Page Not Found!
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          The page you are looking for does not exist.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition font-bold"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-800 text-white px-8 py-3 rounded-lg hover:bg-purple-900 transition font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
