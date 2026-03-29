import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Post Number Badge */}
      <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded mb-3 inline-block">
        Post #{post.id}
      </span>

      {/* Title */}
      <h2 className="text-xl font-bold text-purple-800 mb-3 capitalize">
        {post.title}
      </h2>

      {/* Body Preview */}
      <p className="text-gray-600 mb-4 line-clamp-2">{post.body}</p>

      {/* Read More Link */}
      <Link
        to={`/blog/posts/${post.id}`}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition text-sm font-bold"
      >
        Read More →
      </Link>
    </div>
  );
}

export default PostCard;
