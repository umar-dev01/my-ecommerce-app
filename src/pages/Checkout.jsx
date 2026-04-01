import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Checkout() {
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ─── Form State ───────────────────────────────────────
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "", // ← ADD THIS
    country: "Pakistan",
  });

  const [errors, setErrors] = useState({});

  // ─── Redirect if cart is empty ────────────────────────
  useEffect(() => {
    if (cart.items.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cart.items.length, navigate, orderPlaced]);

  // ─── Derived values ───────────────────────────────────
  const subtotal = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cart.items]);

  const shipping = subtotal < 50 ? 5.99 : 0;
  const total = subtotal + shipping;

  // ─── Handle Input Change ──────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // ─── Validate Form ────────────────────────────────────
  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    // Email format check
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    return newErrors;
  }

  // ─── Handle Submit ────────────────────────────────────
  async function handleSubmit() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || "00000",
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "cod",
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to place order");
      }

      const data = await res.json();

      // ← Mark order as placed BEFORE clearing cart
      setOrderPlaced(true);

      // ← Clear cart
      dispatch({ type: ACTIONS.CLEAR_CART });

      // ← Now navigate safely
      navigate("/order-completed", {
        state: { orderId: data._id || data.data?._id || "N/A" },
      });
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false); // ← only reset on error
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            Checkout
          </h1>
          <p className="text-gray-500 font-lato">
            Home &gt; Cart &gt; Checkout
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Left — Shipping Form ── */}
          <div className="flex-1">
            <h2 className="font-josefin text-2xl font-bold text-hdark mb-6">
              Shipping Information
            </h2>

            {/* API Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
                ❌ {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full border px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs font-lato mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full border px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs font-lato mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  className={`w-full border px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink ${
                    errors.phone ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs font-lato mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street name"
                  className={`w-full border px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink ${
                    errors.address ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-400 text-xs font-lato mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className={`w-full border px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink ${
                    errors.city ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-400 text-xs font-lato mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                >
                  <option>Pakistan</option>
                  <option>India</option>
                  <option>UAE</option>
                  <option>UK</option>
                  <option>USA</option>
                </select>
              </div>
              <div>
                <label className="block font-josefin text-sm font-bold text-hdark mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="44000"
                  className="w-full border border-gray-300 px-4 py-2 font-lato text-sm focus:outline-none focus:border-hpink"
                />
              </div>
            </div>
          </div>

          {/* ── Right — Order Summary ── */}
          <div className="w-full lg:w-96 shrink-0">
            <h2 className="font-josefin text-2xl font-bold text-hdark mb-6">
              Order Summary
            </h2>

            <div className="bg-hlight p-6">
              {/* Items List */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain bg-white p-1"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/56x56?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-josefin font-bold text-hdark text-sm">
                        {item.name}
                      </p>
                      <p className="font-lato text-gray-400 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-josefin font-bold text-hpink text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="font-lato text-gray-500 text-sm">
                    Subtotal
                  </span>
                  <span className="font-josefin font-bold text-hdark">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="font-lato text-gray-500 text-sm">
                    Shipping
                  </span>
                  <span className="font-josefin font-bold text-hdark">
                    {shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-josefin font-bold text-hdark">
                    Total
                  </span>
                  <span className="font-josefin font-bold text-hpink text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full font-josefin font-semibold py-3 mt-6 transition ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-hpink text-white hover:brightness-95"
                }`}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-center text-gray-400 font-lato text-xs mt-3">
                🔒 Your information is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
