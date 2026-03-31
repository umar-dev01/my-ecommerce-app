import { useContext, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const navigate = useNavigate();

  // ─── Derived values ───────────────────────────────────
  const subtotal = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cart.items]);

  const shipping = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  const total = subtotal + shipping;

  // ─── Empty Cart State ─────────────────────────────────
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-hlight py-10 px-8">
          <div className="container mx-auto">
            <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-500 font-lato">Home &gt; Cart</p>
          </div>
        </div>

        {/* Empty Message */}
        <div className="container mx-auto px-8 py-20 text-center">
          <p className="text-6xl mb-6">🛒</p>
          <h2 className="font-josefin text-3xl font-bold text-hdark mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 font-lato mb-8">
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-hpink text-white font-josefin font-semibold px-10 py-3 hover:bg-pink-700 transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; Cart</p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left — Cart Items ── */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 pb-4 border-b border-gray-200 mb-4">
              <p className="col-span-2 font-josefin font-bold text-hdark text-sm">
                Product
              </p>
              <p className="font-josefin font-bold text-hdark text-sm text-center">
                Price
              </p>
              <p className="font-josefin font-bold text-hdark text-sm text-center">
                Quantity
              </p>
              <p className="font-josefin font-bold text-hdark text-sm text-right">
                Total
              </p>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-4 items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-2 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain bg-hlight p-1"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/80x80?text=No+Image";
                      }}
                    />
                    <div>
                      <h3 className="font-josefin font-bold text-hdark text-base">
                        {item.name}
                      </h3>
                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          dispatch({
                            type: ACTIONS.REMOVE_ITEM,
                            payload: { id: item.id, removeAll: true },
                          })
                        }
                        className="text-red-400 hover:text-red-600 font-lato text-xs mt-1 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="font-josefin text-hpink font-bold text-center">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.REMOVE_ITEM,
                          payload: { id: item.id },
                        })
                      }
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 font-bold text-hdark transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-josefin font-bold text-hdark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.ADD_ITEM,
                          payload: {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          },
                        })
                      }
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 font-bold text-hdark transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="font-josefin font-bold text-hdark text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div className="flex justify-between items-center mt-6">
              <Link
                to="/products"
                className="border border-hpink text-hpink font-josefin text-sm px-6 py-2 hover:bg-hpink hover:text-white transition"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={() => dispatch({ type: ACTIONS.CLEAR_CART })}
                className="border border-gray-300 text-gray-500 font-josefin text-sm px-6 py-2 hover:border-red-400 hover:text-red-400 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Right — Order Summary ── */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-hlight p-6">
              <h2 className="font-josefin text-xl font-bold text-hdark mb-6">
                Cart Totals
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-lato text-gray-500 text-sm">
                  Subtotal
                </span>
                <span className="font-josefin font-bold text-hdark">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
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

              {/* Free shipping notice */}
              {shipping > 0 && (
                <p className="text-xs text-gray-400 font-lato mt-2 mb-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              {/* Total */}
              <div className="flex justify-between items-center py-4">
                <span className="font-josefin font-bold text-hdark">Total</span>
                <span className="font-josefin font-bold text-hpink text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-hpink text-white font-josefin font-semibold py-3 hover:bg-pink-700 transition mt-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
