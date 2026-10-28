
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Statistics {
  events: number;
  bookings: number;
  messages: number;
  testimonials: number;
}

function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics>({
    events: 0,
    bookings: 0,
    messages: 0,
    testimonials: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getStatistics() {
      setLoading(true);
      setError("");

      try {
        // Get total events
        const { count: eventsCount, error: eventsError } =
          await supabase
            .from("events")
            .select("*", {
              count: "exact",
              head: true,
            });

        if (eventsError) {
          throw eventsError;
        }

        // Get total bookings
        const { count: bookingsCount, error: bookingsError } =
          await supabase
            .from("bookings")
            .select("*", {
              count: "exact",
              head: true,
            });

        if (bookingsError) {
          throw bookingsError;
        }

        // Get total contact messages
        const { count: messagesCount, error: messagesError } =
          await supabase
            .from("contact_messages")
            .select("*", {
              count: "exact",
              head: true,
            });

        if (messagesError) {
          throw messagesError;
        }

        // Get total testimonials
        const {
          count: testimonialsCount,
          error: testimonialsError,
        } = await supabase
          .from("testimonials")
          .select("*", {
            count: "exact",
            head: true,
          });

        if (testimonialsError) {
          throw testimonialsError;
        }

        setStatistics({
          events: eventsCount ?? 0,
          bookings: bookingsCount ?? 0,
          messages: messagesCount ?? 0,
          testimonials: testimonialsCount ?? 0,
        });

      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );

        setError(
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    getStatistics();
  }, []);

  const statisticsCards = [
    {
      title: "Total Events",
      value: statistics.events,
      icon: "📅",
      link: "/admin/events",
    },
    {
      title: "Total Bookings",
      value: statistics.bookings,
      icon: "📝",
      link: "/admin/bookings",
    },
    {
      title: "Messages",
      value: statistics.messages,
      icon: "📩",
      link: "/admin/messages",
    },
    {
      title: "Testimonials",
      value: statistics.testimonials,
      icon: "⭐",
      link: "/admin/testimonials",
    },
  ];

  return (
    <div>

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to your event management admin dashboard.
        </p>

      </div>

      {/* ================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================= */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

          <h2 className="font-bold text-red-800">
            Dashboard Error
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>

        </div>
      )}

      {/* ================================= */}
      {/* STATISTICS */}
      {/* ================================= */}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {statisticsCards.map((statistic) => (
          <Link
            key={statistic.title}
            to={statistic.link}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {statistic.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : statistic.value}
                </p>

              </div>

              <div className="text-4xl">
                {statistic.icon}
              </div>

            </div>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              Manage →
            </p>

          </Link>
        ))}

      </div>

      {/* ================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================= */}

      <section className="mt-10">

        <h2 className="text-2xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-2 text-gray-600">
          Quickly access the main sections of your admin panel.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          {/* Events */}
          <Link
            to="/admin/events"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              📅
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Manage Events
            </h3>

            <p className="mt-2 text-gray-600">
              Add, edit and manage your upcoming events.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              Open Events →
            </p>

          </Link>

          {/* Bookings */}
          <Link
            to="/admin/bookings"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              📝
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Manage Bookings
            </h3>

            <p className="mt-2 text-gray-600">
              View and manage customer booking requests.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              Open Bookings →
            </p>

          </Link>

          {/* Messages */}
          <Link
            to="/admin/messages"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="text-3xl">
              📩
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Read Messages
            </h3>

            <p className="mt-2 text-gray-600">
              View messages submitted through the contact form.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              Open Messages →
            </p>

          </Link>

        </div>

      </section>

      {/* ================================= */}
      {/* SYSTEM STATUS */}
      {/* ================================= */}

      <section className="mt-10">

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            System Status
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Website
              </p>

              <p className="mt-1 font-semibold text-green-600">
                ● Online
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Database
              </p>

              <p className="mt-1 font-semibold text-green-600">
                ● Connected
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Authentication
              </p>

              <p className="mt-1 font-semibold text-green-600">
                ● Active
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Admin Panel
              </p>

              <p className="mt-1 font-semibold text-green-600">
                ● Protected
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;

