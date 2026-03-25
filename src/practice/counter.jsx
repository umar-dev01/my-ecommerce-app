import { useState } from "react";
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="text-center p-8 border rounded-lg max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-pink-600 text-white px-6 py-2 rounded mr-2 hover:bg-pink-700"
      >
        Increase
      </button>
      <button
        onClick={() => setCount(count - 1)}
        className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
      >
        Decrease
      </button>
    </div>
  );
}
export default Counter;
