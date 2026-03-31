import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 px-8 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Column 1 - Logo + Description */}
        <div>
          <img src="/images/hekto-logo.png" alt="Hekto" className="h-8 mb-4" />
          <p className="text-gray-500 font-lato text-sm mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus
            gravida.
          </p>
          {/* Free delivery badge */}
          <img
            src="/images/free-delivery.png"
            alt="Free Delivery"
            className="h-8"
          />
        </div>

        {/* Column 2 - Categories */}
        <div>
          <h3 className="font-josefin font-bold text-hdark text-lg mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-gray-500 font-lato text-sm">
            <li>
              <Link to="/products" className="hover:text-hpink transition">
                Sofas
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-hpink transition">
                Chairs
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-hpink transition">
                Tables
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-hpink transition">
                Lamps
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Customer Care */}
        <div>
          <h3 className="font-josefin font-bold text-hdark text-lg mb-4">
            Customer Care
          </h3>
          <ul className="space-y-2 text-gray-500 font-lato text-sm">
            <li>
              <Link to="/" className="hover:text-hpink transition">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-hpink transition">
                Checkout
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-hpink transition">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-hpink transition">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 - Newsletter */}
        <div>
          <h3 className="font-josefin font-bold text-hdark text-lg mb-4">
            Newsletter
          </h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none font-lato"
            />
            <button className="bg-hpink text-white px-4 py-2 text-sm font-josefin hover:bg-pink-700 transition">
              Sign Up
            </button>
          </div>
          <p className="text-gray-400 text-xs font-lato mt-2">
            Contact: umr7905@gmail.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-400 font-lato text-sm">
          ©2025 Hekto — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
