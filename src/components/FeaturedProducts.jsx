import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch, ACTIONS } = useContext(CartContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/products`,
        );
        const data = await res.json();
        setProducts(data.products.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-hpink border-t-transparent"></div>
      </div>
    );
  }
  return (
    <section className="py-16 px-8">
      <div className=" container mx-auto">
        <div className=" text-center mb-12">
          <h2 className="font-josefin text-4xl font-bold text-hdark mb-3">
            Featured products
          </h2>
          <div className=" w-16 h-1 bg-hpink mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-hlight relative overflow-hidden"
            >
              <div
                className="h-56 flex item-center justify-center p-4 cursor-pointer"
                onClick={() => {
                  navigate(`/products/${product._id}`);
                }}
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-full object-contain group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x200?text=No+Image";
                  }}
                />
              </div>
              <div className=" p-4 bg-white">
                <h3
                  onClick={() => {
                    navigate(`/products/${product._id}`);
                  }}
                  className="font-josefin font-bold text-hdark text-lg mb-1 cursor-pointer hover:text-hpink transition"
                >
                  {product.name}
                </h3>
                <div className="flex item-center gap-3 mb-3">
                  <span className="text-hpink font-bold">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.ADD_ITEM,
                      payload: {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0],
                      },
                    });
                  }}
                  className="w-full bg-hdark text-white font-josefin py-2 hover:bg-hpurple transition text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="border-2 border-hpink text-hpink font-josefin font-semibold px-10 py-3 hover:bg-hpink hover:text-white transition"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
export default FeaturedProducts;
