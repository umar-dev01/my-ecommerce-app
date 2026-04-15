import { useState } from "react";

function ProductForm({ onSubmit, initialData, isSubmitting = false }) {
  const [productData, setProductData] = useState(
    initialData || {
      name: "",
      price: "",
      category: "",
      description: "",
      stock: "",
    },
  );
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("stock", productData.stock);

    images.forEach((image) => {
      formData.append("images", image);
    });

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-bold mb-1">Product Name</label>
        <input
          type="text"
          value={productData.name}
          onChange={(e) =>
            setProductData({ ...productData, name: e.target.value })
          }
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block font-bold mb-1">Price</label>
        <input
          type="number"
          value={productData.price}
          onChange={(e) =>
            setProductData({ ...productData, price: e.target.value })
          }
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-bold mb-1">Category</label>
        <input
          type="text"
          value={productData.category}
          onChange={(e) =>
            setProductData({ ...productData, category: e.target.value })
          }
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-bold mb-1">Description</label>
        <textarea
          value={productData.description}
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
          rows="4"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block font-bold mb-1">Stock</label>
        <input
          type="number"
          value={productData.stock}
          onChange={(e) =>
            setProductData({ ...productData, stock: e.target.value })
          }
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
          required
        />
      </div>

      {/* Images */}
      <div>
        <label className="block font-bold mb-1">Product Images (max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          disabled={isSubmitting}
          className="w-full border px-4 py-2"
        />

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((preview, idx) => (
              <img
                key={idx}
                src={preview}
                alt={`Preview ${idx + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-pink-600 px-6 py-2 text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Product..." : "Create Product"}
      </button>
    </form>
  );
}

export default ProductForm;
