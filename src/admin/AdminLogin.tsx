
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("LOGIN ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("Admin login successful!");

    navigate("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            EVENTORA
          </h1>

          <p className="mt-2 text-gray-500">
            Admin Login
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-10">

          <h2 className="text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-gray-600">
            Sign in to access the admin dashboard.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            ← Back to Website
          </button>

        </div>

      </div>

    </main>
  );
}

export default AdminLogin;

