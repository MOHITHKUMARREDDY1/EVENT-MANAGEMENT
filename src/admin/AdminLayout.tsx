
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed. Please try again.");
      return;
    }

    console.log("Admin logged out successfully.");

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-gray-900 text-white md:block">

        {/* Logo */}
        <div className="border-b border-gray-700 px-6 py-6">

          <h1 className="text-2xl font-bold">
            EVENTORA
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Admin Dashboard
          </p>

        </div>

        {/* Navigation */}
        <nav className="flex h-[calc(100vh-100px)] flex-col p-4">

          {/* Dashboard */}
          <Link
            to="/admin"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            📊 Dashboard
          </Link>

          {/* Events */}
          <Link
            to="/admin/events"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            📅 Events
          </Link>

          {/* Bookings */}
          <Link
            to="/admin/bookings"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            📝 Bookings
          </Link>

          {/* Messages */}
          <Link
            to="/admin/messages"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            📩 Messages
          </Link>

          {/* Testimonials */}
          <Link
            to="/admin/testimonials"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            ⭐ Testimonials
          </Link>

          {/* Gallery */}
          <Link
            to="/admin/gallery"
            className="mb-2 rounded-xl px-4 py-3 transition hover:bg-gray-800"
          >
            🖼️ Gallery
          </Link>

          {/* Bottom Actions */}
          <div className="mt-auto border-t border-gray-700 pt-4">

            {/* View Website */}
            <Link
              to="/"
              className="mb-2 block rounded-xl px-4 py-3 text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              🌐 View Website
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-red-400 transition hover:bg-gray-800 hover:text-red-300"
            >
              🚪 Logout
            </button>

          </div>

        </nav>

      </aside>

      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="md:ml-64">

        {/* ================================= */}
        {/* TOP BAR */}
        {/* ================================= */}

        <header className="flex items-center justify-between border-b bg-white px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Admin Panel
            </h2>

            <p className="text-sm text-gray-500">
              Manage your event business
            </p>

          </div>

          {/* Mobile Website Link */}
          <Link
            to="/"
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View Website
          </Link>

        </header>

        {/* ================================= */}
        {/* PAGE CONTENT */}
        {/* ================================= */}

        <main className="p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;

