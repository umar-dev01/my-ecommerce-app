import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-purple-100 min-h-screen flex items-center px-12 py-12 relative overflow-hidden">
      {/* Decorative Lamp - Top Left */}
      <div className="absolute top-0 left-12 z-20">
        <img
          src="/public/images/hero-lamp.png"
          alt="Lamp"
          className="h-64 w-auto"
        />
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 pt-8">
        {/* Left Content */}
        <div className="lg:w-1/2 pt-20">
          <p className="text-pink-500 font-lato text-sm font-semibold mb-6">
            Best Furniture For Your Castl...
          </p>
          <h1 className="font-josefin text-7xl font-bold text-black leading-tight mb-8">
            New Furniture <br /> Collection <br /> Trends in 2020
          </h1>
          <p className="text-gray-600 font-lato text-base mb-10 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in
            est adipiscing in phasellus non justo.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-pink-500 text-white font-lato font-semibold px-14 py-4 hover:bg-pink-600 transition rounded-sm text-base"
          >
            Shop Now
          </button>
        </div>

        {/* Right Content - Sofa with Circle */}
        <div className="lg:w-1/2 flex justify-center items-center relative h-full min-h-96">
          {/* Pink Circle Background - Larger */}
          <div className="absolute w-full h-full max-w-2xl aspect-square bg-gradient-to-br from-pink-200 to-pink-300 rounded-full z-0"></div>

          {/* 50% Off Badge - Blue Circle */}
          <div className="absolute top-16 right-20 z-20">
            <div className="w-28 h-28 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-center shadow-lg">
              <div>
                <div className="text-4xl">50%</div>
                <div className="text-base">off</div>
              </div>
            </div>
          </div>

          {/* Sofa Image - Larger */}
          <img
            src="/public/images/hero-sofa.png"
            alt="Hero sofa"
            className="w-full max-w-2xl object-contain z-10"
          />

          {/* Decorative Dot - Bottom Right */}
          <div className="absolute bottom-20 right-12 w-4 h-4 bg-pink-500 rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
