
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string | null;
  event_date: string | null;
  guests: number | null;
  message: string | null;
  status: string;
  created_at: string;
}

function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchMessages() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("FETCH MESSAGES ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleMarkAsRead(messageId: string) {
    setUpdatingId(messageId);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("contact_messages")
      .update({
        status: "read",
      })
      .eq("id", messageId);

    if (error) {
      console.error("UPDATE MESSAGE ERROR:", error);
      setError(error.message);
      setUpdatingId(null);
      return;
    }

    setMessages((previousMessages) =>
      previousMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              status: "read",
            }
          : message
      )
    );

    setSuccess("Message marked as read.");
    setUpdatingId(null);
  }

  function formatDate(date: string | null) {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCreatedAt(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusClasses(status: string) {
    if (status === "read") {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-blue-100 text-blue-700";
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Contact Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Messages
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage messages received from website visitors.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">
            Something went wrong
          </p>

          <p className="mt-1 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-600">
            Loading messages...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && messages.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">📩</div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No messages yet
          </h2>

          <p className="mt-2 text-gray-500">
            Messages submitted through the Contact page will appear here.
          </p>
        </div>
      )}

      {/* Messages */}
      {!loading && messages.length > 0 && (
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`overflow-hidden rounded-2xl bg-white shadow-sm ${
                message.status !== "read"
                  ? "ring-2 ring-blue-100"
                  : ""
              }`}
            >
              {/* Message Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {message.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        message.status
                      )}`}
                    >
                      {message.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Received:{" "}
                    {formatCreatedAt(message.created_at)}
                  </p>
                </div>

                {/* Mark Read */}
                {message.status !== "read" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleMarkAsRead(message.id)
                    }
                    disabled={updatingId === message.id}
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === message.id
                      ? "Updating..."
                      : "✓ Mark as Read"}
                  </button>
                )}
              </div>

              {/* Customer Information */}
              <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </h3>

                  <p className="mt-2 break-all text-gray-800">
                    {message.email}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </h3>

                  <p className="mt-2 text-gray-800">
                    {message.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Event Type
                  </h3>

                  <p className="mt-2 capitalize text-gray-800">
                    {message.event_type || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Event Date
                  </h3>

                  <p className="mt-2 text-gray-800">
                    {formatDate(message.event_date)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Guests
                  </h3>

                  <p className="mt-2 text-gray-800">
                    {message.guests ?? "Not specified"}
                  </p>
                </div>

                {/* Customer Message */}
                <div className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Message
                  </h3>

                  <div className="mt-2 rounded-xl bg-gray-50 p-5">
                    <p className="whitespace-pre-wrap leading-7 text-gray-700">
                      {message.message ||
                        "No message provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessages;

