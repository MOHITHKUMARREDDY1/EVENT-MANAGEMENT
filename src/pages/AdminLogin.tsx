import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      email.trim() === "admin@example.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold text-purple-950">
            Admin Login
          </h1>

          <p className="mt-2 text-gray-600">
            Sign in to manage your event website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700"
            />
          </div>

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
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">
            Local development login
          </p>
          <p className="mt-1">Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}