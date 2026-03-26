import { createContext, useReducer } from "react";
export const CartContext = createContext();

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
    return totalPrice < 50 && totalPrice > 0 ? 5.99 : 0;
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
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const value = {
    cart,
    dispatch,
    ACTIONS,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
