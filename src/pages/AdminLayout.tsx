
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Events", path: "/admin/events" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Messages", path: "/admin/messages" },
    { name: "Testimonials", path: "/admin/testimonials" },
    { name: "Gallery", path: "/admin/gallery" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">
              Event Management
            </h1>

            <p className="text-sm text-purple-200">
              Admin Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg px-4 py-2 text-sm hover:bg-purple-900"
            >
              View Website
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <nav className="mb-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-purple-900 shadow-sm hover:bg-purple-50"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}

