
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  event: string | null;
  review: string;
  rating: number | null;
  is_published: boolean;
  created_at: string;
}

interface TestimonialFormData {
  name: string;
  role: string;
  event: string;
  review: string;
  rating: string;
  is_published: boolean;
}

const emptyForm: TestimonialFormData = {
  name: "",
  role: "",
  event: "",
  review: "",
  rating: "5",
  is_published: true,
};

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [formData, setFormData] =
    useState<TestimonialFormData>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchTestimonials() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "FETCH TESTIMONIALS ERROR:",
        error
      );

      setError(error.message);
      setLoading(false);
      return;
    }

    setTestimonials(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePublishChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormData((previous) => ({
      ...previous,
      is_published: event.target.checked,
    }));
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id);

    setFormData({
      name: testimonial.name,
      role: testimonial.role || "",
      event: testimonial.event || "",
      review: testimonial.review,
      rating: String(testimonial.rating || 5),
      is_published: testimonial.is_published,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter the customer name.");
      setSaving(false);
      return;
    }

    if (!formData.review.trim()) {
      setError("Please enter the testimonial review.");
      setSaving(false);
      return;
    }

    const rating = Number(formData.rating);

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      setSaving(false);
      return;
    }

    const testimonialData = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      event: formData.event.trim(),
      review: formData.review.trim(),
      rating,
      is_published: formData.is_published,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from("testimonials")
        .update(testimonialData)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error(
          "UPDATE TESTIMONIAL ERROR:",
          error
        );

        setError(error.message);
        setSaving(false);
        return;
      }

      setTestimonials((previous) =>
        previous.map((testimonial) =>
          testimonial.id === editingId
            ? data
            : testimonial
        )
      );

      setSuccess(
        "Testimonial updated successfully!"
      );
    } else {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([testimonialData])
        .select()
        .single();

      if (error) {
        console.error(
          "INSERT TESTIMONIAL ERROR:",
          error
        );

        setError(error.message);
        setSaving(false);
        return;
      }

      setTestimonials((previous) => [
        data,
        ...previous,
      ]);

      setSuccess(
        "Testimonial added successfully!"
      );
    }

    setFormData(emptyForm);
    setEditingId(null);
    setSaving(false);
  }

  async function handleDelete(
    testimonial: Testimonial
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial from "${testimonial.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(testimonial.id);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", testimonial.id);

    if (error) {
      console.error(
        "DELETE TESTIMONIAL ERROR:",
        error
      );

      setError(error.message);
      setDeletingId(null);
      return;
    }

    setTestimonials((previous) =>
      previous.filter(
        (item) => item.id !== testimonial.id
      )
    );

    setSuccess(
      "Testimonial deleted successfully!"
    );

    setDeletingId(null);
  }

  async function handleTogglePublish(
    testimonial: Testimonial
  ) {
    setError("");
    setSuccess("");

    const newValue = !testimonial.is_published;

    const { error } = await supabase
      .from("testimonials")
      .update({
        is_published: newValue,
      })
      .eq("id", testimonial.id);

    if (error) {
      console.error(
        "TOGGLE PUBLISH ERROR:",
        error
      );

      setError(error.message);
      return;
    }

    setTestimonials((previous) =>
      previous.map((item) =>
        item.id === testimonial.id
          ? {
              ...item,
              is_published: newValue,
            }
          : item
      )
    );

    setSuccess(
      newValue
        ? "Testimonial published."
        : "Testimonial unpublished."
    );
  }

  function renderStars(rating: number | null) {
    const count = rating || 0;

    return (
      <div className="text-lg">
        {"★".repeat(count)}
        {"☆".repeat(5 - count)}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Review Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Testimonials
        </h1>

        <p className="mt-2 text-gray-600">
          Add and manage customer testimonials displayed on your website.
        </p>
      </div>

      {/* Messages */}
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

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId
                ? "Edit Testimonial"
                : "Add Testimonial"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update the customer testimonial."
                : "Add a new customer testimonial."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name / Role */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Customer Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Example: Rahul Sharma"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Role / Customer Type
              </label>

              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Example: Wedding Client"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          {/* Event / Rating */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="event"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Event
              </label>

              <input
                id="event"
                name="event"
                type="text"
                value={formData.event}
                onChange={handleInputChange}
                placeholder="Example: Wedding"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Rating
              </label>

              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4 Stars
                </option>

                <option value="3">
                  3 Stars
                </option>

                <option value="2">
                  2 Stars
                </option>

                <option value="1">
                  1 Star
                </option>
              </select>
            </div>
          </div>

          {/* Review */}
          <div>
            <label
              htmlFor="review"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Review *
            </label>

            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              placeholder="Write the customer's testimonial..."
              rows={5}
              required
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Publish */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={handlePublishChange}
              className="h-5 w-5 rounded border-gray-300"
            />

            <span className="text-sm font-semibold text-gray-700">
              Publish this testimonial on the website
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Testimonial"
                : "Add Testimonial"}
          </button>
        </form>
      </div>

      {/* Testimonials List */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            All Testimonials
          </h2>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
            {testimonials.length} Total
          </span>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading testimonials...
            </p>
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">⭐</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No testimonials yet
            </h3>

            <p className="mt-2 text-gray-500">
              Add your first customer testimonial above.
            </p>
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {testimonial.name}
                    </h3>

                    {testimonial.role && (
                      <p className="mt-1 text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    )}

                    {testimonial.event && (
                      <p className="mt-1 text-sm font-medium text-blue-600">
                        {testimonial.event}
                      </p>
                    )}
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      testimonial.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {testimonial.is_published
                      ? "Published"
                      : "Hidden"}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Review */}
                <p className="mt-4 leading-7 text-gray-600">
                  "{testimonial.review}"
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(testimonial)
                    }
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleTogglePublish(testimonial)
                    }
                    className="rounded-full border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    {testimonial.is_published
                      ? "Hide"
                      : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(testimonial)
                    }
                    disabled={
                      deletingId === testimonial.id
                    }
                    className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === testimonial.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTestimonials;
