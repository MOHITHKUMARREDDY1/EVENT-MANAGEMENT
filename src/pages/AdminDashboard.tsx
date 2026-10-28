
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Image,
  MessageSquare,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  events: number;
  bookings: number;
  messages: number;
  testimonials: number;
  gallery: number;
}

interface RecentBooking {
  id: string;
  customer_name: string | null;
  name: string | null;
  event_type: string | null;
  event_date: string | null;
  status: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    events: 0,
    bookings: 0,
    messages: 0,
    testimonials: 0,
    gallery: 0,
  });

  const [recentBookings, setRecentBookings] = useState<
    RecentBooking[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          eventsResult,
          bookingsResult,
          messagesResult,
          testimonialsResult,
          galleryResult,
          recentBookingsResult,
        ] = await Promise.all([
          supabase
            .from("events")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("bookings")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("testimonials")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("gallery")
            .select("id", { count: "exact", head: true }),

          supabase
            .from("bookings")
            .select(
              "id, customer_name, name, event_type, event_date, status, created_at"
            )
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        const results = [
          eventsResult,
          bookingsResult,
          messagesResult,
          testimonialsResult,
          galleryResult,
          recentBookingsResult,
        ];

        const failedResult = results.find(
          (result) => result.error
        );

        if (failedResult?.error) {
          console.error(
            "ADMIN DASHBOARD ERROR:",
            failedResult.error
          );

          setError(
            `Unable to load dashboard data: ${failedResult.error.message}`
          );

          return;
        }

        setStats({
          events: eventsResult.count ?? 0,
          bookings: bookingsResult.count ?? 0,
          messages: messagesResult.count ?? 0,
          testimonials: testimonialsResult.count ?? 0,
          gallery: galleryResult.count ?? 0,
        });

        setRecentBookings(
          recentBookingsResult.data ?? []
        );
      } catch (caughtError: unknown) {
        console.error(
          "ADMIN DASHBOARD UNEXPECTED ERROR:",
          caughtError
        );

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError(
            "Something went wrong while loading the dashboard."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Events",
      value: stats.events,
      icon: CalendarDays,
      link: "/admin/events",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: ClipboardList,
      link: "/admin/bookings",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      link: "/admin/messages",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: Star,
      link: "/admin/testimonials",
    },
    {
      title: "Gallery Images",
      value: stats.gallery,
      icon: Image,
      link: "/admin/gallery",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Event Management
          </p>

          <h1 className="text-3xl font-bold text-purple-950 md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your events, bookings, messages, testimonials
            and gallery from one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Dashboard Error:</strong> {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-amber-600"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-purple-950">
                  {loading ? "..." : card.value}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-purple-950">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/admin/events"
              className="rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100"
            >
              <CalendarDays className="mb-3 text-purple-900" size={22} />

              <h3 className="font-semibold text-purple-950">
                Manage Events
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Add, view and delete events.
              </p>
            </Link>

            <Link
              to="/admin/bookings"
              className="rounded-xl border border-amber-100 bg-amber-50 p-4 transition hover:border-amber-300 hover:bg-amber-100"
            >
              <ClipboardList className="mb-3 text-amber-700" size={22} />

              <h3 className="font-semibold text-purple-950">
                Manage Bookings
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Review and update customer bookings.
              </p>
            </Link>

            <Link
              to="/admin/messages"
              className="rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100"
            >
              <MessageSquare className="mb-3 text-purple-900" size={22} />

              <h3 className="font-semibold text-purple-950">
                View Messages
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Read customer enquiries.
              </p>
            </Link>

            <Link
              to="/admin/gallery"
              className="rounded-xl border border-amber-100 bg-amber-50 p-4 transition hover:border-amber-300 hover:bg-amber-100"
            >
              <Image className="mb-3 text-amber-700" size={22} />

              <h3 className="font-semibold text-purple-950">
                Manage Gallery
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Upload and manage event images.
              </p>
            </Link>

          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-purple-950">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer booking requests.
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-900 hover:text-amber-600"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading recent bookings...
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Event
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => {
                    const customer =
                      booking.customer_name ||
                      booking.name ||
                      "Unknown Customer";

                    return (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {customer}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.event_type || "Not specified"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.event_date
                            ? new Date(
                                booking.event_date
                              ).toLocaleDateString("en-IN")
                            : "Not specified"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {booking.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer-related section */}
        <div className="mt-8 rounded-2xl bg-purple-950 p-6 text-white md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-amber-400">
                <Users size={20} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Customer Management
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                Keep track of every event enquiry.
              </h2>

              <p className="mt-2 max-w-2xl text-purple-200">
                Use bookings and messages to follow up with customers
                and manage their event requirements.
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              View Bookings
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

