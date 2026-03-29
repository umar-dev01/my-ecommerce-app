import { Link } from "react-router-dom";
function BlogNavbar() {
  return (
    <nav className="bg-purple-800 text-white px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/blog" className="text-2xl font-bold text-pink-400">
          MyBlog ✍️
        </Link>

        {/* Links */}
        <div className="flex gap-6">
          <Link to="/blog" className="hover:text-pink-400 transition">
            Home
          </Link>
          <Link to="/blog/about" className="hover:text-pink-400 transition">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default BlogNavbar;
