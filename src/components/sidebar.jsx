function Sidebar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Category Filter */}
      <div className="bg-white p-6 shadow-sm">
        <h3 className="font-josefin font-bold text-hdark text-lg mb-4">
          Categories
        </h3>

        <ul className="space-y-2">
          {/* All categories option */}
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`flex items-center gap-2 w-full text-left font-lato text-sm py-1 transition ${
                selectedCategory === "all"
                  ? "text-hpink font-bold"
                  : "text-gray-500 hover:text-hpink"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedCategory === "all" ? "bg-hpink" : "bg-gray-300"
                }`}
              />
              All Products
            </button>
          </li>

          {/* Dynamic categories from backend */}
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center gap-2 w-full text-left font-lato text-sm py-1 transition capitalize ${
                  selectedCategory === cat
                    ? "text-hpink font-bold"
                    : "text-gray-500 hover:text-hpink"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedCategory === cat ? "bg-hpink" : "bg-gray-300"
                  }`}
                />
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range Info */}
      <div className="bg-white p-6 shadow-sm mt-4">
        <h3 className="font-josefin font-bold text-hdark text-lg mb-4">
          Price Range
        </h3>
        <p className="text-gray-500 font-lato text-sm">
          Sort using the dropdown above to filter by price.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
