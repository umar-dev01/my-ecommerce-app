import { useState, useMemo } from "react";
import useFetch from "../hooks/userFetch";
import PostCard from "../compunents/PostCard";

function BlogHome() {
  const [search, setSearch] = useState("");

  // ✅ Custom hook - one line fetches everything
  const {
    data: posts,
    isLoading,
    error,
  } = useFetch("https://jsonplaceholder.typicode.com/posts");

  // ✅ useMemo - only filters when posts or search changes
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [posts, search]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-purple-800 mb-4">
            My Blog ✍️
          </h1>
          <p className="text-gray-600 text-xl">
            {filteredPosts.length} posts available
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-800"
          />
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500 text-xl">
            No posts found for "{search}"
          </p>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogHome;
