import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogNavbar from "./compunents/BlogNavbar";
import BlogHome from "./pages/BlogHome";
import BlogPost from "./pages/BlogPost";
import BlogAbout from "./pages/BlogAbout";
function BlogApp() {
  return (
    <BrowserRouter>
      <BlogNavbar />
      <Routes>
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/posts/:id" element={<BlogPost />} />
        <Route path="/blog/about" element={<BlogAbout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default BlogApp;
