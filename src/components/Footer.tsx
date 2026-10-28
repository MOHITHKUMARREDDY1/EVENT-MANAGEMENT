
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 bg-purple-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* Company */}
        <div>
          <Link
            to="/"
            className="inline-block text-2xl font-bold tracking-wide text-white transition hover:text-amber-400"
          >
            Event Management
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-purple-200">
            We create memorable and successful events for every occasion,
            with professional planning, decoration, entertainment, and
            complete event management.
          </p>

          <Link
            to="/booking"
            className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Book Your Event
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              to="/"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              About
            </Link>

            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Services
            </Link>

            <Link
              to="/events"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Events
            </Link>

            <Link
              to="/gallery"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Gallery
            </Link>

            <Link
              to="/testimonials"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Testimonials
            </Link>

            <Link
              to="/contact"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Our Services
          </h3>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Event Planning
            </Link>

            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Decoration
            </Link>

            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Entertainment
            </Link>

            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Wedding Events
            </Link>

            <Link
              to="/services"
              className="text-sm text-purple-200 transition hover:text-amber-400"
            >
              Corporate Events
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Contact Us
          </h3>

          <div className="mt-5 space-y-5 text-sm">

            {/* Phone */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Phone
              </p>

              <a
                href="tel:8985500481"
                className="mt-1 block text-purple-200 transition hover:text-white"
              >
                +91 8985500481
              </a>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Email
              </p>

              <a
                href="mailto:bandimohithkumarreddy@gmail.com"
                className="mt-1 block break-all text-purple-200 transition hover:text-white"
              >
                bandimohithkumarreddy@gmail.com
              </a>
            </div>

            {/* Booking */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Need an Event?
              </p>

              <Link
                to="/booking"
                className="mt-1 inline-block text-purple-200 transition hover:text-white"
              >
                Send us your booking request →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center text-sm md:flex-row md:items-center md:justify-between md:text-left">

          <p className="text-purple-300">
            © {new Date().getFullYear()} Event Management. All rights reserved.
          </p>

          <div className="flex justify-center gap-5">
            <Link
              to="/"
              className="text-purple-300 transition hover:text-amber-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/"
              className="text-purple-300 transition hover:text-amber-400"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;

