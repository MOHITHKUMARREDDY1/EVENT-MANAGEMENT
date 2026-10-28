
import {  useEffect, useState } from "react";
import React,{type FormEvent} from "react";
import { supabase } from "../lib/supabase";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
}

interface EventFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  event_date: string;
  location: string;
  image_url: string;
  status: string;
}

const emptyForm: EventFormData = {
  title: "",
  slug: "",
  description: "",
  category: "",
  event_date: "",
  location: "",
  image_url: "",
  status: "upcoming",
};

function AdminEvents() {
  const [events, setEvents] = useState<EventData[]>([]);

  const [formData, setFormData] =
    useState<EventFormData>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------------
  // LOAD EVENTS
  // ----------------------------------------

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", {
        ascending: true,
      });

    if (error) {
      console.error("FETCH EVENTS ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setEvents(data ?? []);
    setLoading(false);
  }

  // ----------------------------------------
  // HANDLE FORM INPUT
  // ----------------------------------------

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ----------------------------------------
  // OPEN ADD FORM
  // ----------------------------------------

  function handleAddEvent() {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ----------------------------------------
  // OPEN EDIT FORM
  // ----------------------------------------

  function handleEditEvent(event: EventData) {
    setEditingId(event.id);

    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description ?? "",
      category: event.category ?? "",
      event_date: event.event_date ?? "",
      location: event.location ?? "",
      image_url: event.image_url ?? "",
      status: event.status ?? "upcoming",
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ----------------------------------------
  // CANCEL FORM
  // ----------------------------------------

  function handleCancel() {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(false);
    setError("");
  }

  // ----------------------------------------
  // ADD / UPDATE EVENT
  // ----------------------------------------

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    // UPDATE

    if (editingId) {
      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title.trim(),
          slug: formData.slug.trim().toLowerCase(),
          description:
            formData.description.trim() || null,
          category: formData.category || null,
          event_date: formData.event_date || null,
          location:
            formData.location.trim() || null,
          image_url:
            formData.image_url.trim() || null,
          status: formData.status,
        })
        .eq("id", editingId);

      if (error) {
        console.error("UPDATE EVENT ERROR:", error);
        setError(error.message);
        setSaving(false);
        return;
      }

      setSuccess("Event updated successfully!");
    }

    // INSERT

    else {
      const { error } = await supabase
        .from("events")
        .insert([
          {
            title: formData.title.trim(),
            slug: formData.slug.trim().toLowerCase(),
            description:
              formData.description.trim() || null,
            category: formData.category || null,
            event_date: formData.event_date || null,
            location:
              formData.location.trim() || null,
            image_url:
              formData.image_url.trim() || null,
            status: formData.status,
          },
        ]);

      if (error) {
        console.error("ADD EVENT ERROR:", error);
        setError(error.message);
        setSaving(false);
        return;
      }

      setSuccess("Event added successfully!");
    }

    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(false);

    await fetchEvents();

    setSaving(false);
  }

  // ----------------------------------------
  // DELETE EVENT
  // ----------------------------------------

  async function handleDeleteEvent(event: EventData) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(event.id);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.error("DELETE EVENT ERROR:", error);
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setSuccess("Event deleted successfully!");

    setEvents((previousEvents) =>
      previousEvents.filter(
        (previousEvent) =>
          previousEvent.id !== event.id
      )
    );

    setDeletingId(null);
  }

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Events
          </h1>

          <p className="mt-2 text-gray-600">
            Add, edit, delete and manage events.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEvent}
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Event
        </button>
      </div>

      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId
              ? "Edit Event"
              : "Add New Event"}
          </h2>

          <p className="mt-2 text-gray-600">
            {editingId
              ? "Update the event information below."
              : "Enter the event information below."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-semibold text-gray-700"
              >
                Event Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Grand Music Festival"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* SLUG */}

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block font-semibold text-gray-700"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Use lowercase letters, numbers and hyphens only."
                placeholder="grand-music-festival"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Example: grand-music-festival
              </p>
            </div>

            {/* CATEGORY */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block font-semibold text-gray-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select category
                </option>

                <option value="Music">
                  Music
                </option>

                <option value="Wedding">
                  Wedding
                </option>

                <option value="Corporate">
                  Corporate
                </option>

                <option value="Birthday">
                  Birthday
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Family">
                  Family
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* DATE */}

            <div>
              <label
                htmlFor="event_date"
                className="mb-2 block font-semibold text-gray-700"
              >
                Event Date
              </label>

              <input
                id="event_date"
                name="event_date"
                type="date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* LOCATION */}

            <div>
              <label
                htmlFor="location"
                className="mb-2 block font-semibold text-gray-700"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Tirupati"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* STATUS */}

            <div>
              <label
                htmlFor="status"
                className="mb-2 block font-semibold text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="upcoming">
                  Upcoming
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* IMAGE */}

            <div className="md:col-span-2">
              <label
                htmlFor="image_url"
                className="mb-2 block font-semibold text-gray-700"
              >
                Image URL
              </label>

              <input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/event-image.jpg"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block font-semibold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the event..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* FORM BUTTONS */}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? editingId
                    ? "Updating Event..."
                    : "Saving Event..."
                  : editingId
                    ? "Update Event"
                    : "Save Event"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-full border border-gray-300 px-7 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* EVENTS LIST */}

      <section className="mt-8">
        <div className="rounded-2xl bg-white shadow-sm">
          {/* HEADER */}

          <div className="border-b border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Events
            </h2>

            <p className="mt-1 text-gray-500">
              {events.length} event
              {events.length !== 1 ? "s" : ""} found.
            </p>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="p-8 text-center">
              <div className="text-4xl">
                📅
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                Loading events...
              </p>
            </div>
          )}

          {/* EMPTY */}

          {!loading && events.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl">
                📭
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                No events found.
              </p>

              <p className="mt-1 text-gray-500">
                Click "Add Event" to create your
                first event.
              </p>
            </div>
          )}

          {/* EVENT CARDS */}

          {!loading && events.length > 0 && (
            <div className="grid gap-6 p-6 lg:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  {/* IMAGE */}

                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100">
                      <span className="text-5xl">
                        📅
                      </span>
                    </div>
                  )}

                  {/* DETAILS */}

                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {event.category || "Other"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          event.status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : event.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-green-50 text-green-700"
                        }`}
                      >
                        {event.status || "upcoming"}
                      </span>
                    </div>

                    {/* TITLE */}

                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>

                    {/* DATE */}

                    <p className="mt-2 text-sm text-gray-500">
                      📅{" "}
                      {event.event_date
                        ? new Date(
                            `${event.event_date}T00:00:00`
                          ).toLocaleDateString()
                        : "Date not set"}
                    </p>

                    {/* LOCATION */}

                    <p className="mt-1 text-sm text-gray-500">
                      📍{" "}
                      {event.location ||
                        "Location not set"}
                    </p>

                    {/* DESCRIPTION */}

                    {event.description && (
                      <p className="mt-4 leading-6 text-gray-600">
                        {event.description}
                      </p>
                    )}

                    {/* SLUG */}

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400">
                        Slug: {event.slug}
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleEditEvent(event)
                        }
                        disabled={
                          deletingId === event.id
                        }
                        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✏️ Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteEvent(event)
                        }
                        disabled={
                          deletingId === event.id
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === event.id
                          ? "Deleting..."
                          : "🗑️ Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminEvents;

