import { useState } from "react";

function SimpleInput() {
  const [text, setText] = useState("");

  return (
    <div className="p-4 border rounded max-w-sm">
      <h3 className="font-bold mb-2">Exercise 1: Simple Input</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        className="border p-2 rounded w-full mb-2"
      />
      <p className="text-gray-600">
        You typed: <span className="font-bold">{text}</span>
      </p>
      <p className="text-sm text-gray-400">Characters: {text.length}</p>
    </div>
  );
}

export default SimpleInput;
