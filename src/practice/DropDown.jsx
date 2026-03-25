import { useState } from 'react';

function DropdownSelect() {
  const [category, setCategory] = useState('');

  return (
    <div className="p-4 border rounded max-w-sm mt-4">
      <h3 className="font-bold mb-2">Exercise 3: Category Select</h3>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">-- Select Category --</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="home">Home & Garden</option>
      </select>
      {category && (
        <p className="mt-2">You selected: <span className="font-bold">{category}</span></p>
      )}
    </div>
  );
}

export default DropdownSelect;