import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetails from "./pages/productDetails";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
// import TaskManager from "./practice/TaskManager";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Pages WITH Navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Pages WITHOUT Navbar */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
