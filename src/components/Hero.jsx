import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-purple-100 px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12 lg:py-12 2xl:px-20">
      {/* Decorative Lamp */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 lg:left-4 lg:top-4 lg:translate-x-0 xl:left-12 xl:top-0 2xl:left-20">
        <img
          src="/images/hero-lamp.png"
          alt="Lamp"
          className="h-28 w-auto sm:h-36 lg:h-44 xl:h-64 2xl:h-72"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col-reverse items-center justify-between gap-10 pt-16 sm:pt-20 lg:flex-row lg:gap-16 lg:pt-12 xl:pt-8 2xl:gap-24">
        {/* Left Content */}
        <div className="w-full text-center lg:w-[46%] lg:pt-24 lg:text-left xl:pt-20 2xl:pt-24">
          <p className="mb-4 font-lato text-xs font-semibold text-pink-500 sm:text-sm lg:mb-6 2xl:text-base">
            Best Furniture For Your Castl...
          </p>
          <h1 className="mb-5 font-josefin text-4xl font-bold leading-tight text-black sm:text-5xl lg:mb-8 lg:max-w-2xl lg:text-7xl 2xl:max-w-3xl 2xl:text-[5.5rem]">
            New Furniture Collection Trends in 2020
          </h1>
          <p className="mx-auto mb-8 max-w-md font-lato text-sm leading-relaxed text-gray-600 sm:text-base lg:mx-0 lg:mb-10 lg:max-w-xl 2xl:max-w-2xl 2xl:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in
            est adipiscing in phasellus non justo.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="rounded-sm bg-pink-500 px-8 py-3 font-lato text-sm font-semibold text-white transition hover:bg-pink-600 sm:px-10 sm:py-4 sm:text-base lg:px-14 2xl:px-16 2xl:py-5 2xl:text-lg"
          >
            Shop Now
          </button>
        </div>

        {/* Right Content - Sofa with Circle */}
        <div className="relative flex min-h-[260px] w-full items-center justify-center sm:min-h-[320px] lg:min-h-[520px] lg:w-[54%] 2xl:min-h-[680px]">
          {/* Pink Circle Background */}
          <div className="absolute z-0 aspect-square w-[85%] max-w-xs rounded-full bg-gradient-to-br from-pink-200 to-pink-300 sm:max-w-md lg:h-full lg:w-full lg:max-w-2xl 2xl:max-w-[880px]"></div>

          {/* 50% Off Badge */}
          <div className="absolute right-3 top-6 z-20 sm:right-8 sm:top-10 lg:right-8 lg:top-10 xl:right-14 xl:top-14 2xl:right-28 2xl:top-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-center font-bold text-white shadow-lg sm:h-20 sm:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 2xl:h-32 2xl:w-32">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">50%</div>
                <div className="text-[10px] uppercase tracking-wide sm:text-xs lg:text-sm xl:text-base 2xl:text-lg">
                  off
                </div>
              </div>
            </div>
          </div>

          {/* Sofa Image */}
          <img
            src="/images/hero-sofa.png"
            alt="Hero sofa"
            className="relative z-10 w-full max-w-xs object-contain sm:max-w-md lg:max-w-2xl 2xl:max-w-[900px]"
          />

          {/* Decorative Dot */}
          <div className="absolute bottom-4 right-6 z-0 h-3 w-3 rounded-full bg-pink-500 sm:bottom-10 sm:right-10 lg:bottom-20 lg:right-12 lg:h-4 lg:w-4 2xl:bottom-24 2xl:right-20 2xl:h-5 2xl:w-5"></div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
