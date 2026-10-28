
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ContactMessage {
  id: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  created_at?: string | null;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("ADMIN MESSAGES ERROR:", fetchError);
        setError(`Could not load messages: ${fetchError.message}`);
        return;
      }

      setMessages(data ?? []);
    } catch (caughtError: unknown) {
      console.error("ADMIN MESSAGES UNEXPECTED ERROR:", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-950">
              Messages
            </h1>

            <p className="mt-2 text-gray-600">
              View messages submitted through the contact form.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Messages"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">
              Error loading messages
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchMessages}
              className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-950" />

            <p className="text-gray-600">
              Loading messages...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && messages.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              No messages found
            </h2>

            <p className="mt-2 text-gray-500">
              Contact form messages will appear here.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && messages.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-purple-950 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Name
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Contact
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Subject
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Message
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-5 align-top">
                        <p className="font-semibold text-gray-900">
                          {message.name || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-5 align-top">
                        <p className="text-sm text-gray-800">
                          {message.email || "-"}
                        </p>

                        {message.phone && (
                          <p className="mt-1 text-sm text-gray-500">
                            {message.phone}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-5 align-top">
                        <p className="text-sm font-medium text-gray-800">
                          {message.subject || "-"}
                        </p>
                      </td>

                      <td className="max-w-md px-4 py-5 align-top">
                        <p className="text-sm text-gray-700">
                          {message.message || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-5 align-top text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && !error && messages.length > 0 && (
          <div className="space-y-4 md:hidden">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-gray-900">
                      {message.name || "Unknown"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {message.email || "-"}
                    </p>
                  </div>
                </div>

                {message.phone && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>

                    <p className="text-sm text-gray-800">
                      {message.phone}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Subject
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {message.subject || "-"}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Message
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {message.message || "-"}
                  </p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Submitted
                  </p>

                  <p className="text-sm text-gray-700">
                    {formatDate(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


