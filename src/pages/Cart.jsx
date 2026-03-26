import { useContext } from "react";
import { CartContext } from "../context/CartContext";
function Cart() {
  const { cart, dispatch, ACTIONS } = useContext(CartContext);
  const grandTotal = Number((cart.totalPrice + cart.shipping).toFixed(2));
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">
        🛒 Shopping Cart with useReducer
      </h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-2">Cart Summary</h3>
        <p className="text-gray-700">
          Items in cart: <span className="font-bold">{cart.totalItems}</span>
        </p>
        <p className="text-gray-700">
          Subtotal:{" "}
          <span className="font-bold">${cart.totalPrice.toFixed(2)}</span>
        </p>
        <p className="text-gray-700">
          Shipping:{" "}
          <span className="font-bold text-pink-600">
            {cart.totalPrice > 0
              ? cart.shipping === 0
                ? "🎉 Free!"
                : `$${cart.shipping}`
              : "$0.00"}
          </span>
        </p>
        {cart.totalPrice < 50 && cart.totalPrice > 0 && (
          <p className="text-xs text-green-600 mt-1">
            Add ${(50 - cart.totalPrice).toFixed(2)} more for free shipping!
          </p>
        )}
        <p className="text-gray-700 font-bold">
          Grand Total:{" "}
          <span className="text-pink-600">
            {cart.totalPrice > 0 ? grandTotal.toFixed(2) : "$0.00"}
          </span>
        </p>
        {cart.lastUpdated && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(cart.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Cart Items - FIXED with Tailwind */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Cart Contents</h3>
        {cart.items.length === 0 ? (
          <p className="text-gray-500 italic">Cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-3 border-b border-gray-200"
              >
                <span className="text-gray-800">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-pink-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Add Products</h3>

        <button
          onClick={() => dispatch({ type: ACTIONS.CLEAR_CART })}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;
