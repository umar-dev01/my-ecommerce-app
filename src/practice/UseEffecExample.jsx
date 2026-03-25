import { useState, useEffect } from "react";

function UseEffectExample() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  // useEffect 1: Runs ONCE when component loads
  useEffect(() => {
    console.log("1️⃣ Component LOADED - runs once");
    setMessage("Welcome! Component mounted");
  }, []); // Empty array = run once

  // useEffect 2: Runs EVERY TIME count changes
  useEffect(() => {
    console.log("2️⃣ Count CHANGED to:", count);
    setMessage(`Count is now ${count}`);
  }, [count]); // [count] = run when 'count' changes

  // useEffect 3: Runs on EVERY render
  useEffect(() => {
    console.log("3️⃣ Component RENDERED");
  }); // No array = run after every render

  return (
    <div className="p-4 border rounded max-w-sm">
      <h2 className="font-bold text-xl mb-4">useEffect Demo</h2>
      <p className="mb-2">Count: {count}</p>
      <p className="mb-4 text-blue-600">{message}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-pink-600 text-white px-4 py-2 rounded"
      >
        Increase Count
      </button>
      <p className="text-xs text-gray-400 mt-4">Check the console (F12)</p>
    </div>
  );
}

export default UseEffectExample;
