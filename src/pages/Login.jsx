import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useContext(AuthContext);
  const [email, setEmail] = useState(location.state?.prefillEmail || "");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (location.state?.prefillEmail) {
      setEmail(location.state.prefillEmail);
    }
  }, [location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setLocalError("Please enter a valid email");
      return;
    }
    const results = await login(email, password);
    if (results.success) {
      navigate("/");
    } else {
      setLocalError(results.error);
      alert("wrong");
    }
  }
  // if (isLoggedIn) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
  //         <h1 className="text-3xl font-bold text-purple-800 mb-4">
  //           Welcome Back! 👋
  //         </h1>
  //         <p className="text-gray-600 mb-6">
  //           {localStorage.getItem("userEmail")}
  //         </p>
  //         <button
  //           onClick={handleLogout}
  //           className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-bold"
  //         >
  //           Logout
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Title */}
        <button
          onClick={() => navigate("/")}
          className="text-hdark font-bold mb-6 hover:text-hpink transition"
        >
          ← Back to Products
        </button>
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account
        </p>

        {/* Error Messages */}
        {(localError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {localError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-hpink text-white font-bold py-2 rounded-lg hover:brightness-95 transition disabled:bg-gray-400"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <hr className="my-6" />

        {/* Register Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-hpink font-bold hover:brightness-95"
          >
            Create one
          </Link>
        </p>

        {/* Forgot Password Link */}
        <p className="text-center text-gray-600 mt-4">
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:text-purple-700 text-sm"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
