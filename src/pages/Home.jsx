import { useState } from "react";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import BrandLogos from "../components/BrandLogos";
// import ProductList from "../components/ProductList";
// import SearchBar from "../components/SearchBar";
function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <BrandLogos />
    </div>
  );
}

export default Home;
