import { useState } from "react";

function ToggleCheckbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-4 border rounded max-w-sm mt-4">
      <h3 className="font-bold mb-2">Exercise 2: Checkbox Toggle</h3>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span>Accept Terms & Conditions</span>
      </label>
      {isChecked ? (
        <p className="text-green-600 mt-2">✓ You accepted! Proceed.</p>
      ) : (
        <p className="text-red-500 mt-2">✗ Please accept to continue</p>
      )}
    </div>
  );
}

export default ToggleCheckbox;
