import { useState } from "react";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  function handleSearch(query) {
    setSearchQuery(query);
  }
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 max-w-md mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>
      <p className="text-center text-gray-500 mb-4">
        {searchQuery ? `Searching: "${searchQuery}"` : "Showing all products"}
      </p>
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">
        My E-Commerce Store
      </h1>
      <div className="container mx-auto p-4">
        <ProductList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default Home;
