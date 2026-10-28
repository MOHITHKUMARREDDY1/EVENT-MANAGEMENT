
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Booking {
  id: number | string;
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

type BookingStatus = "confirmed" | "cancelled" | "completed";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "An unexpected error occurred. Please try again.";
}

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
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBookings((data ?? []) as Booking[]);
    } catch (err) {
      console.error("ADMIN BOOKINGS FETCH ERROR:", err);
      setError(
        `Unable to load bookings: ${getErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (
    booking: Booking,
    newStatus: BookingStatus
  ) => {
    if (updatingId !== null) return;

    const bookingId = String(booking.id);

    setUpdatingId(bookingId);
    setError("");
    setSuccess("");

    try {
      console.log("Attempting booking status update:", {
        id: booking.id,
        currentStatus: booking.status,
        newStatus,
      });

      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", booking.id)
        .select("id, status");

      if (updateError) {
        console.error("SUPABASE UPDATE ERROR:", {
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint,
        });

        throw new Error(
          `${updateError.message} (Code: ${updateError.code || "unknown"})`
        );
      }

      if (!data || data.length === 0) {
        throw new Error(
          "Supabase updated zero rows. The booking may not exist, or your current Supabase role may not have permission to update and read it. Check the booking ID and database policies."
        );
      }

      const updatedBooking = data[0];

      setBookings((previous) =>
        previous.map((item) =>
          String(item.id) === bookingId
            ? {
                ...item,
                status: updatedBooking.status ?? newStatus,
              }
            : item
        )
      );

      setSuccess(
        `Booking ${bookingId} successfully updated to ${
          updatedBooking.status ?? newStatus
        }.`
      );

      console.log("BOOKING STATUS UPDATE SUCCESS:", updatedBooking);
    } catch (err) {
      console.error("BOOKING STATUS UPDATE FAILED:", err);

      setError(
        `Booking update failed: ${getErrorMessage(err)}`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (
    date: string | null | undefined
  ): string => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCustomerName = (booking: Booking) =>
    booking.customer_name || booking.name || "Unknown Customer";

  const getStatusStyle = (status?: string | null) => {
    switch ((status || "pending").toLowerCase()) {
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

  const getStatus = (booking: Booking) =>
    (booking.status || "pending").toLowerCase();

  const pendingCount = bookings.filter(
    (booking) => getStatus(booking) === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => getStatus(booking) === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => getStatus(booking) === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-950">
              Manage Bookings
            </h1>
            <p className="mt-2 text-gray-600">
              Review customer requests and manage booking statuses.
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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="mt-2 text-3xl font-bold text-purple-950">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {confirmedCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {completedCount}
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p className="font-bold">Booking operation failed</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
          >
            <p className="font-semibold">Success</p>
            <p className="mt-1">{success}</p>
          </div>
        )}

        {loading && bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              No bookings to display
            </h2>
            <p className="mt-2 text-gray-500">
              If loading failed, check the error above and try again.
            </p>
            <button
              type="button"
              onClick={() => void fetchBookings()}
              disabled={loading}
              className="mt-4 rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-purple-950 text-white">
                  <tr>
                    {[
                      "Customer",
                      "Contact",
                      "Event",
                      "Event Date",
                      "Guests",
                      "Status",
                      "Created",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-4 text-left text-sm font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => {
                    const status = getStatus(booking);
                    const isUpdating =
                      updatingId === String(booking.id);
                    const isTerminalStatus =
                      status === "cancelled" ||
                      status === "completed";

                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-900">
                            {getCustomerName(booking)}
                          </div>
                          {booking.message && (
                            <p className="mt-1 max-w-xs whitespace-pre-wrap break-words text-sm text-gray-500">
                              {booking.message}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div>{booking.phone || "-"}</div>
                          <div>{booking.email || "-"}</div>
                        </td>

                        <td className="px-4 py-4 text-gray-700">
                          {booking.event_type || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                          {formatDate(booking.event_date)}
                        </td>

                        <td className="px-4 py-4 text-gray-700">
                          {booking.guests ?? "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex min-w-36 flex-col gap-2">
                            {!isTerminalStatus &&
                              status !== "confirmed" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void updateBookingStatus(
                                      booking,
                                      "confirmed"
                                    )
                                  }
                                  disabled={updatingId !== null}
                                  className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Confirm"}
                                </button>
                              )}

                            {!isTerminalStatus &&
                              status !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    void updateBookingStatus(
                                      booking,
                                      "completed"
                                    );
                                  }}
                                  disabled={updatingId !== null}
                                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : "Mark Completed"}
                                </button>
                              )}

                            {!isTerminalStatus && (
                              <button
                                type="button"
                                onClick={() => {
                                  const confirmed =
                                    window.confirm(
                                      "Are you sure you want to cancel this booking?"
                                    );

                                  if (confirmed) {
                                    void updateBookingStatus(
                                      booking,
                                      "cancelled"
                                    );
                                  }
                                }}
                                disabled={updatingId !== null}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "Cancel Booking"}
                              </button>
                            )}

                            {status === "cancelled" && (
                              <span className="text-sm text-red-600">
                                Booking cancelled
                              </span>
                            )}

                            {status === "completed" && (
                              <span className="text-sm text-blue-600">
                                Event completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
