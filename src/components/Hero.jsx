import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section
      //   class="cont"
      className="bg-hlight min-h-[600px] flex item-center px-8 py-16"
    >
      <div className="container mx-auto flex flex-col lg:flex-row item-center justify-center relative p-6">
        <div className="absolute  mb-10 -top-[110px] left-0">
          <img
            className="max-w-[60%]"
            src="/public/images/hero-lamp.png"
            alt=""
          />
        </div>
        <div className="lg:w-1/2 mt-20">
          <p className=" text-hpink font-lato text-lg mb-2">
            Best Furniture for your Castle...
          </p>
          <h1 className=" font-josefin text-5xl lg:text-5xl font-bold text-black leading-tight mb-6">
            New Furniture Collection
            <br /> Trends in 2026
          </h1>
          <p className="text-gray-500 font-lato mb-8 max-w-md">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis
            temporibus, unde cum autem praesentium nam labore explicabo deleniti
            et laborum quaerat iure
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-hpink text-white font-josefin font-semibold px-10 py-3 hover:bg-pink-700 transition"
          >
            Shop Now
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center relative">
          <img
            src="/public/images/badge-50off.png"
            alt="%50 off"
            className="absolute top-0 right-10 w-20 z-10"
          />
          <img
            src="/public/images/hero-sofa.png"
            alt="Hero sofa"
            className=" w-full max-w-lg object-contain"
          />
        </div>
      </div>
    </section>
  );
}
export default Hero;
