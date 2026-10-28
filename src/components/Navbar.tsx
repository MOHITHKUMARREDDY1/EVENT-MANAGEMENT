
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-purple-950/95 text-white shadow-lg backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center"
          aria-label="Event Management - Home"
        >
          <div>
            <div className="truncate text-lg font-bold tracking-wide text-white transition group-hover:text-amber-300 sm:text-xl">
              Event Management
            </div>

            <div className="hidden text-[10px] font-medium uppercase tracking-[0.25em] text-amber-400 sm:block">
              Creating Memorable Experiences
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative rounded-lg px-3 py-2.5 text-sm font-semibold transition duration-200 ${
                isActive(item.path)
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Booking Button */}
        <Link
          to="/booking"
          className="hidden shrink-0 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-amber-600 hover:shadow-lg lg:block"
        >
          Book Your Event
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-xl text-white transition hover:bg-white/10 lg:hidden"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-white/10 bg-purple-950 transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[600px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3.5 font-semibold transition ${
                  isActive(item.path)
                    ? "bg-amber-500 text-white"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <Link
              to="/booking"
              onClick={closeMenu}
              className="block rounded-full bg-amber-500 px-5 py-3.5 text-center font-bold text-white shadow-md transition hover:bg-amber-600"
            >
              Book Your Event
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

