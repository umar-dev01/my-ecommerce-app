import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";

function Footer() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  function handleNewsletterSignup(event) {
    event.preventDefault();
    navigate("/login", {
      state: { prefillEmail: newsletterEmail.trim() },
    });
  }

  return (
    <footer className="border-t border-gray-200 bg-white pt-12">
      <Container className="pb-8">
        <div className="rounded-[1.5rem] border border-gray-100 bg-white px-6 py-8 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr]">
            <div className="max-w-sm">
              <img src="/images/hekto-logo.png" alt="Hekto" className="mb-5 h-9" />
              <p className="mb-6 font-lato text-sm leading-7 text-gray-500 sm:text-base">
                Curated furniture and decor made to bring softness, comfort, and
                character into every corner of your home.
              </p>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-hlight px-4 py-3">
                <img
                  src="/images/free-delivery.png"
                  alt="Free Delivery"
                  className="h-9"
                />
                <div>
                  <p className="font-josefin text-sm font-semibold text-hdark">
                    Free delivery
                  </p>
                  <p className="font-lato text-xs text-gray-500">
                    On selected orders nationwide
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-josefin text-xl font-bold text-hdark">
                Categories
              </h3>
              <ul className="space-y-3 font-lato text-sm text-gray-500">
                <li>
                  <Link
                    to="/products?category=sofas"
                    className="transition hover:text-hpink"
                  >
                    Sofas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=chairs"
                    className="transition hover:text-hpink"
                  >
                    Chairs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=tables"
                    className="transition hover:text-hpink"
                  >
                    Tables
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=lamps"
                    className="transition hover:text-hpink"
                  >
                    Lamps
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-josefin text-xl font-bold text-hdark">
                Customer Care
              </h3>
              <ul className="space-y-3 font-lato text-sm text-gray-500">
                <li>
                  <Link to="/orders" className="transition hover:text-hpink">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="transition hover:text-hpink">
                    Checkout
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="transition hover:text-hpink">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="transition hover:text-hpink">
                    Shop
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-[1.25rem] bg-hlight p-5 sm:p-6">
              <h3 className="mb-3 font-josefin text-xl font-bold text-hdark">
                Newsletter
              </h3>
              <p className="mb-5 font-lato text-sm leading-6 text-gray-500">
                Get product drops, styling inspiration, and member-only offers.
              </p>
              <form
                className="flex flex-col gap-3"
                onSubmit={handleNewsletterSignup}
              >
                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:flex-row lg:flex-col xl:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    required
                    className="min-w-0 flex-1 px-4 py-3 font-lato text-sm text-gray-700 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-hpink px-5 py-3 font-josefin text-sm text-white transition hover:brightness-95 sm:min-w-[120px]"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="mt-4 font-lato text-xs text-gray-500">
                Contact us: umr7905@gmail.com
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-5">
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="font-lato text-sm text-gray-500">
                Designed to make furniture shopping feel simple and elegant.
              </p>
              <p className="font-lato text-sm text-gray-400">
                Copyright 2026 Hekto. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
