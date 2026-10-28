
import { type FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface EventItem {
  id: number | string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  event_date?: string | null;
  location?: string | null;
  image_url?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface EventForm {
  title: string;
  slug: string;
  description: string;
  category: string;
  event_date: string;
  location: string;
  image_url: string;
  status: string;
}

const emptyForm: EventForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  event_date: "",
  location: "",
  image_url: "",
  status: "published",
};

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("ADMIN EVENTS ERROR:", fetchError);
      setError(`Could not load events: ${fetchError.message}`);
    } else {
      setEvents(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const title = event.target.value;

    setForm((previous) => ({
      ...previous,
      title,
      slug: createSlug(title),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter an event title.");
      setSaving(false);
      return;
    }

    if (!form.slug.trim()) {
      setError("Please enter an event slug.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("events")
      .insert([
        {
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          category: form.category.trim() || null,
          event_date: form.event_date || null,
          location: form.location.trim() || null,
          image_url: form.image_url.trim() || null,
          status: form.status,
        },
      ]);

    if (insertError) {
      console.error("CREATE EVENT ERROR:", insertError);
      setError(`Could not create event: ${insertError.message}`);
    } else {
      setSuccess("Event created successfully.");
      setForm(emptyForm);
      await fetchEvents();
    }

    setSaving(false);
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("DELETE EVENT ERROR:", deleteError);
      setError(`Could not delete event: ${deleteError.message}`);
      return;
    }

    setSuccess("Event deleted successfully.");
    await fetchEvents();
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return "Not specified";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-950">
            Manage Events
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage events stored in your Supabase database.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Add Event Form */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md md:p-8">
          <h2 className="mb-6 text-2xl font-bold text-purple-950">
            Add New Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Event Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Grand Music Festival"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="grand-music-festival"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the event..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Wedding"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label
                  htmlFor="event_date"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Event Date
                </label>

                <input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Tirupati"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="image_url"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Image URL
              </label>

              <input
                id="image_url"
                name="image_url"
                type="url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/event-image.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Event..." : "Add Event"}
            </button>
          </form>
        </div>

        {/* Events List */}
        <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-950">
                Existing Events
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {events.length} event{events.length === 1 ? "" : "s"} found
              </p>
            </div>

            <button
              type="button"
              onClick={fetchEvents}
              disabled={loading}
              className="rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white hover:bg-purple-900 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && (
            <div className="py-10 text-center text-gray-600">
              Loading events...
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-gray-600">
                No events found.
              </p>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="space-y-4">
              {events.map((eventItem) => (
                <div
                  key={eventItem.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-purple-950">
                          {eventItem.title}
                        </h3>

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                          {eventItem.status || "published"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        /events/{eventItem.slug}
                      </p>

                      {eventItem.description && (
                        <p className="mt-3 text-gray-700">
                          {eventItem.description}
                        </p>
                      )}

                      <div className="mt-4 grid gap-2 text-sm text-gray-600 md:grid-cols-3">
                        <p>
                          <strong>Category:</strong>{" "}
                          {eventItem.category || "-"}
                        </p>

                        <p>
                          <strong>Date:</strong>{" "}
                          {formatDate(eventItem.event_date)}
                        </p>

                        <p>
                          <strong>Location:</strong>{" "}
                          {eventItem.location || "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(eventItem.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
