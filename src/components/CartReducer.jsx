import { useReducer } from "react";
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  shipping: 5.99,
  lastUpdated: null,
};
//for spell mistake
const ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_CART: "CLEAR_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
};
function cartReducer(state, action) {
  //first
  function calculateShipping(totalPrice) {
    return totalPrice < 50 ? 5.99 : 0;
  }
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      console.log(existingItem);
      let updateItem;
      if (existingItem) {
        // Item exists - increase quantity
        updateItem = state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // New item - add with quantity 1
        updateItem = [...state.items, { ...newItem, quantity: 1 }];
      }
      const newTotalItems = state.totalItems + 1;
      const newTotalPrice = state.totalPrice + newItem.price;
      return {
        ...state,
        items: updateItem,
        totalPrice: Number(newTotalPrice.toFixed(2)),
        totalItems: newTotalItems,
        shipping: calculateShipping(newTotalPrice),
        lastUpdated: new Date().toISOString(),
      };
    }
    case ACTIONS.REMOVE_ITEM: {
      const itemId = action.payload.id;
      const itemToRemove = state.items.find((item) => item.id === itemId);
      if (!itemToRemove) return state;
      let updateItems; //array
      if (itemToRemove.quantity > 1) {
        updateItems = state.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        );
      } else {
        updateItems = state.items.filter((item) => item.id !== itemId);
      }
      return {
        ...state,
        items: updateItems,
        totalItems: state.totalItems - 1,
        totalPrice: Number((state.totalPrice - itemToRemove.price).toFixed(2)),
        shipping: calculateShipping(state.totalPrice),
        lastUpdated: new Date().toISOString(),
      };
    }
    case ACTIONS.CLEAR_CART:
      return {
        ...initialState,
        lastUpdated: new Date().toISOString(),
      };
    default:
      console.warn("Unknown action type:", action.type);
      return state;
  }
}
function CartReducer() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const products = [
    { id: 1, name: "Wireless Headphones", price: 99.99 },
    { id: 2, name: "Smart Watch", price: 29 },
    { id: 3, name: "Camera Lens", price: 299.99 },
    { id: 4, name: "Bluetooth Speaker", price: 79.99 },
  ];
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
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between items-center">
              <span className="text-gray-800">
                {product.name} - ${product.price}
              </span>
              <button
                onClick={() =>
                  dispatch({
                    type: ACTIONS.ADD_ITEM,
                    payload: product,
                  })
                }
                className="bg-pink-600 text-white px-4 py-1.5 rounded text-sm hover:bg-pink-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: ACTIONS.REMOVE_ITEM,
                    payload: product,
                  })
                }
                className="bg-pink-600 text-white px-4 py-1.5 rounded text-sm hover:bg-pink-700 transition"
              >
                Remove To Cart
              </button>
            </div>
          ))}
        </div>

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
export default CartReducer;
