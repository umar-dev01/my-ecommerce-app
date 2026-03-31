import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Send to parent on EVERY keystroke
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search products..."
        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
      />
    </div>
  );
}

export default SearchBar;
