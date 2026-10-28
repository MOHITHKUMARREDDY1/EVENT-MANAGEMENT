
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Booking {
  id: string | number;
  customer_name?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  guests?: number | null;
  message?: string | null;
  status?: string | null;
  created_at?: string | null;
}

type BookingStatus = "confirmed" | "cancelled";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Select only columns used by this page.
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, name, email, phone, event_type, event_date, guests, message, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBookings((data ?? []) as Booking[]);
    } catch (err) {
      console.error("Error loading bookings:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load bookings. Check your Supabase connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (
    bookingId: string | number,
    newStatus: BookingStatus
  ) => {
    if (updatingId !== null) return;

    setUpdatingId(String(bookingId));
    setError("");
    setSuccess("");

    try {
      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId)
        .select("id, status");

      if (updateError) {
        throw updateError;
      }

      // An empty result can mean the row was not visible to UPDATE
      // because of RLS, or the booking ID did not match.
      if (!data || data.length === 0) {
        throw new Error(
          "No booking was updated. Check that the booking ID exists and your Supabase UPDATE policy permits this user to update it."
        );
      }

      setBookings((previous) =>
        previous.map((booking) =>
          String(booking.id) === String(bookingId)
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      setSuccess(
        newStatus === "confirmed"
          ? "Booking confirmed successfully."
          : "Booking cancelled successfully."
      );
    } catch (err) {
      console.error("Booking status update failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update booking status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getCustomerName = (booking: Booking) =>
    booking.name || booking.customer_name || "Unknown Customer";

  const getStatus = (status?: string | null) =>
    (status || "pending").toLowerCase();

  const formatDate = (value?: string | null) => {
    if (!value) return "Not specified";

    // Handle date-only values without timezone shifting.
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

    const date = dateOnly
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status?: string | null) => {
    switch (getStatus(status)) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const confirmBooking = (booking: Booking) => {
    void updateBookingStatus(booking.id, "confirmed");
  };

  const cancelBooking = (booking: Booking) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the booking for ${getCustomerName(booking)}?`
      )
    ) {
      void updateBookingStatus(booking.id, "cancelled");
    }
  };

  const renderActions = (booking: Booking) => {
    const status = getStatus(booking.status);
    const isUpdating = updatingId === String(booking.id);

    if (status === "confirmed") {
      return (
        <span className="text-sm font-medium text-green-700">
          Booking confirmed
        </span>
      );
    }

    if (status === "cancelled") {
      return (
        <span className="text-sm font-medium text-red-700">
          Booking cancelled
        </span>
      );
    }

    if (status === "completed") {
      return (
        <span className="text-sm font-medium text-blue-700">
          Event completed
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => confirmBooking(booking)}
          disabled={updatingId !== null}
          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Confirm"}
        </button>

        <button
          type="button"
          onClick={() => cancelBooking(booking)}
          disabled={updatingId !== null}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Cancel"}
        </button>
      </div>
    );
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => getStatus(booking.status) === "pending"
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => getStatus(booking.status) === "confirmed"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => getStatus(booking.status) === "cancelled"
  ).length;

  return (
    <div className="min-h-screen space-y-6 bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-950">
              Booking Management
            </h1>
            <p className="mt-2 text-gray-600">
              Review customer bookings and manage confirmation status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchBookings()}
            disabled={loading || updatingId !== null}
            className="rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Bookings"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p className="font-semibold">Booking operation failed</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
          >
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Bookings", count: totalBookings, color: "text-purple-950" },
            { label: "Pending", count: pendingBookings, color: "text-yellow-600" },
            { label: "Confirmed", count: confirmedBookings, color: "text-green-600" },
            { label: "Cancelled", count: cancelledBookings, color: "text-red-600" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                {item.count}
              </p>
            </div>
          ))}
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-purple-950">
              No bookings found
            </h2>
            <p className="mt-2 text-gray-500">
              Customer booking requests will appear here.
            </p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-purple-950 text-white">
                    <tr>
                      {["Customer", "Event", "Event Date", "Guests", "Status", "Created", "Actions"].map(
                        (heading) => (
                          <th key={heading} className="px-4 py-4 text-left">
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-900">
                            {getCustomerName(booking)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.email || "No email"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.phone || "No phone"}
                          </p>
                          {booking.message && (
                            <p className="mt-2 max-w-xs text-sm text-gray-500">
                              {booking.message}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {booking.event_type || "Not specified"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                          {formatDate(booking.event_date)}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {booking.guests ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(booking.status)}`}>
                            {getStatus(booking.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          {renderActions(booking)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-purple-950">
                        {getCustomerName(booking)}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {booking.email || "No email"}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(booking.status)}`}>
                      {getStatus(booking.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 break-words text-sm text-gray-600">
                    <p><strong>Phone:</strong> {booking.phone || "Not provided"}</p>
                    <p><strong>Event:</strong> {booking.event_type || "Not specified"}</p>
                    <p><strong>Event date:</strong> {formatDate(booking.event_date)}</p>
                    <p><strong>Guests:</strong> {booking.guests ?? "-"}</p>
                    <p><strong>Booking created:</strong> {formatDate(booking.created_at)}</p>
                    {booking.message && (
                      <p><strong>Message:</strong> {booking.message}</p>
                    )}
                  </div>

                  <div className="mt-5">{renderActions(booking)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
