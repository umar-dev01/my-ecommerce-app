import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();
  function handleChange(e) {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("plz fill in all fields");
      return;
    }
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", formData.email);
    navigate("/");
  }
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            {localStorage.getItem("userEmail")}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Login 🔐
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-800"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-800"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-bold"
        >
          Login
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-purple-800 font-bold cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
