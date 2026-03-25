import { useState } from "react";
function ColorChanger() {
  const [color, setcolor] = useState(null);
  const handlechange = (e) => {
    setcolor(e.target.value);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6">
      <div
        className="w-64 h-64 rounded-lg border-2 border-red-400 transition-colors duration-300"
        style={{ backgroundColor: color }}
      />
      <input
        value={color}
        onChange={handlechange}
        className="w-64 px-3 py-2 border border-blue-300 rounded text-sm text-gray-700 outline-none focus:border-blue-500"
      />
    </div>
  );
}
export default ColorChanger;
