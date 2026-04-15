import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductsForm";
import { AuthContext } from "../context/AuthContext";
import { createProduct } from "../utils/productsApi";

function extractCreatedProduct(payload) {
  return payload?.data?.product || payload?.product || payload?.data || null;
}

function AddProduct() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const isAdmin = useMemo(() => {
    const role = (user?.role || "").toLowerCase();
    return role === "admin" || role === "seller" || role === "manager";
  }, [user?.role]);

  async function handleCreateProduct(formData) {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage("");

      const payload = await createProduct({ formData, token });
      const createdProduct = extractCreatedProduct(payload);
      const createdId = createdProduct?._id || createdProduct?.id;

      setSuccessMessage("Product created successfully");

      if (createdId) {
        navigate(`/products/${createdId}`);
        return;
      }

      navigate("/products");
    } catch (err) {
      setError(err.message || "Unable to add product");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-hlight py-10 px-8">
          <div className="container mx-auto">
            <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
              Add Product
            </h1>
            <p className="text-gray-500 font-lato">Home &gt; Add Product</p>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10">
          <div className="max-w-2xl bg-white p-6 shadow-sm border border-red-100">
            <h2 className="font-josefin text-2xl font-bold text-hdark mb-3">
              Permission Required
            </h2>
            <p className="font-lato text-red-600 mb-5">
              Only admin accounts can create products.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-hdark text-white px-6 py-2 font-josefin font-semibold hover:bg-indigo-900 transition"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hlight py-10 px-8">
        <div className="container mx-auto">
          <h1 className="font-josefin text-4xl font-bold text-hdark mb-2">
            Add Product
          </h1>
          <p className="text-gray-500 font-lato">Home &gt; Add Product</p>
        </div>
      </div>

      <div className="container mx-auto px-8 py-10">
        <div className="max-w-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="font-josefin text-2xl font-bold text-hdark">
              Create New Product
            </h2>
            <span className="font-lato text-xs text-gray-500">
              {import.meta.env.PROD ? "Production" : "Development"} mode
            </span>
          </div>

          {successMessage ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 font-lato text-sm mb-6">
              {successMessage}
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-lato text-sm mb-6">
              {error}
            </div>
          ) : null}

          <div className={isSubmitting ? "opacity-70" : ""}>
            <ProductForm
              onSubmit={handleCreateProduct}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
