import { useReducer } from "react";

// STEP 1: Define the reducer function OUTSIDE the component
// Why outside? Because it doesn't need anything from the component
function counterReducer(state, action) {
  // currentState is whatever the count is right now
  // action is an object that tells us what to do
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "ADD_AMOUNT":
      return state + action.payload;
    case "DECREMENT":
      return state - 1;
    case "MULTIPLY":
      return state * action.factor;
    case "RESET":
      return 0;
    default:
      return state;
  }
}

function CounterReducer() {
  // STEP 2: Set up useReducer
  // Syntax: const [state, dispatch] = useReducer(reducerFunction, initialValue)
  const [count, dispatch] = useReducer(counterReducer, 0);

  // STEP 3: Create functions that dispatch actions
  function handleIncrement() {
    // dispatch sends an action to the reducer
    dispatch({ type: "INCREMENT" });
  }

  function handleDecrement() {
    dispatch({ type: "DECREMENT" });
  }

  function handleReset() {
    dispatch({ type: "RESET" });
  }
  function handlemultipy() {
    dispatch({ type: "MULTIPLY", factor: 2 });
  }
  function handlepayload() {
    dispatch({ type: "ADD_AMOUNT", payload: 5 });
  }

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>Counter with useReducer</h2>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>Count: {count}</p>
      <button onClick={handleIncrement}>+ Increment</button>
      <button onClick={handleDecrement}>- Decrement</button>
      <button onClick={handlemultipy}>multuply by 2</button>
      <button onClick={handlepayload}>add factory</button>
      <button onClick={handleReset}>↺ Reset</button>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Open Console (F12) to see what happens when you click buttons</p>
      </div>
    </div>
  );
}

export default CounterReducer;
