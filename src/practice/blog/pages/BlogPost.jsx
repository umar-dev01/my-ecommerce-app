import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/userFetch";

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: post,
    isLoding,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const { data: comments } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
  );
  if (isLoding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">❌ {error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blog")}
          className="text-purple-800 font-bold mb-6 hover:text-pink-600 transition"
        >
          ← Back to Blog
        </button>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded mb-4 inline-block">
            Post #{post?.id}
          </span>
          <h1 className="text-3xl font-bold text-purple-800 mb-6 capitalize">
            {post?.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">{post?.body}</p>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">
            💬 Comments ({comments?.length || 0})
          </h2>

          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 pb-4 mb-4 last:border-b-0"
            >
              <p className="font-bold text-gray-800 capitalize">
                {comment.name}
              </p>
              <p className="text-pink-600 text-sm mb-2">{comment.email}</p>
              <p className="text-gray-600">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default BlogPost;
