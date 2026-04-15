function BrandLogos() {
  return (
    <section className="bg-hlight px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="container mx-auto">
        <div className="mb-5 text-center lg:hidden">
          <p className="font-lato text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Trusted Brands
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white/70 px-4 py-5 shadow-sm backdrop-blur sm:px-6 lg:overflow-visible lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
          <img
            src="/images/logos.png"
            alt="Brand Partners"
            className="h-auto min-w-[620px] object-contain lg:min-w-0 lg:w-full"
          />
        </div>
      </div>
    </section>
  );
}

export default BrandLogos;
