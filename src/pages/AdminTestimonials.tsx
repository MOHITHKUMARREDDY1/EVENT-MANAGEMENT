
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

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTestimonials = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("testimonials")
      .select(
        "id, name, role, event, review, rating, is_published, created_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("ADMIN TESTIMONIALS ERROR:", fetchError);

      setError(
        `Could not load testimonials: ${fetchError.message}`
      );

      setLoading(false);
      return;
    }

    setTestimonials(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchTestimonials();
  }, []);

  const approveTestimonial = async (id: string) => {
    const confirmed = window.confirm(
      "Approve this review and show it publicly?"
    );

    if (!confirmed) {
      return;
    }

    const { error: updateError } = await supabase
      .from("testimonials")
      .update({
        is_published: true,
      })
      .eq("id", id);

    if (updateError) {
      console.error(
        "APPROVE TESTIMONIAL ERROR:",
        updateError
      );

      alert(
        `Approval failed: ${updateError.message}`
      );

      return;
    }

    setTestimonials((current) =>
      current.map((testimonial) =>
        testimonial.id === id
          ? {
              ...testimonial,
              is_published: true,
            }
          : testimonial
      )
    );
  };

  const unpublishTestimonial = async (id: string) => {
    const confirmed = window.confirm(
      "Remove this review from the public website?"
    );

    if (!confirmed) {
      return;
    }

    const { error: updateError } = await supabase
      .from("testimonials")
      .update({
        is_published: false,
      })
      .eq("id", id);

    if (updateError) {
      console.error(
        "UNPUBLISH TESTIMONIAL ERROR:",
        updateError
      );

      alert(
        `Update failed: ${updateError.message}`
      );

      return;
    }

    setTestimonials((current) =>
      current.map((testimonial) =>
        testimonial.id === id
          ? {
              ...testimonial,
              is_published: false,
            }
          : testimonial
      )
    );
  };

  const deleteTestimonial = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "DELETE TESTIMONIAL ERROR:",
        deleteError
      );

      alert(
        `Delete failed: ${deleteError.message}`
      );

      return;
    }

    setTestimonials((current) =>
      current.filter(
        (testimonial) => testimonial.id !== id
      )
    );
  };

  const formatDate = (date: string) => {
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

  const pendingTestimonials = testimonials.filter(
    (testimonial) => !testimonial.is_published
  );

  const publishedTestimonials = testimonials.filter(
    (testimonial) => testimonial.is_published
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-widest text-amber-600">
              Admin Panel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-purple-950 md:text-4xl">
              Testimonials
            </h1>

            <p className="mt-2 text-gray-600">
              Review customer feedback and approve testimonials
              for the public website.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTestimonials}
            disabled={loading}
            className="rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-bold">
              Testimonial Error
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
        {!loading && !error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Pending Reviews
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingTestimonials.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Published Reviews
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {publishedTestimonials.length}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-950" />

            <p className="text-gray-600">
              Loading testimonials...
            </p>
          </div>
        )}

        {/* No reviews */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="text-5xl">⭐</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No Customer Reviews Yet
            </h2>

            <p className="mt-2 text-gray-600">
              Customer reviews submitted from the website
              will appear here.
            </p>
          </div>
        )}

        {/* Pending Reviews */}
        {!loading &&
          !error &&
          pendingTestimonials.length > 0 && (
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-purple-950">
                  Pending Reviews
                </h2>

                <p className="mt-1 text-gray-600">
                  These reviews are waiting for your approval.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingTestimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-2xl border-2 border-amber-200 bg-white p-6 shadow-md"
                  >
                    {/* Status */}
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                      Pending Approval
                    </span>

                    {/* Name */}
                    <h3 className="mt-4 text-xl font-bold text-purple-950">
                      {testimonial.name}
                    </h3>

                    {/* Optional Details */}
                    {testimonial.role && (
                      <p className="mt-1 text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    )}

                    {testimonial.event && (
                      <p className="mt-2 text-sm font-semibold text-blue-600">
                        {testimonial.event}
                      </p>
                    )}

                    {/* Rating */}
                    {testimonial.rating !== null && (
                      <div className="mt-4 text-lg text-amber-500">
                        {"★".repeat(
                          Math.max(
                            0,
                            Math.min(5, testimonial.rating)
                          )
                        )}
                        {"☆".repeat(
                          5 -
                            Math.max(
                              0,
                              Math.min(5, testimonial.rating)
                            )
                        )}
                      </div>
                    )}

                    {/* Review */}
                    <blockquote className="mt-4 leading-7 text-gray-700">
                      “{testimonial.review}”
                    </blockquote>

                    {/* Date */}
                    <p className="mt-4 text-xs text-gray-400">
                      Submitted:{" "}
                      {formatDate(testimonial.created_at)}
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          approveTestimonial(testimonial.id)
                        }
                        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                      >
                        ✓ Approve Review
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTestimonial(testimonial.id)
                        }
                        className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete Review
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

        {/* Published Reviews */}
        {!loading &&
          !error &&
          publishedTestimonials.length > 0 && (
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-purple-950">
                  Published Reviews
                </h2>

                <p className="mt-1 text-gray-600">
                  These reviews are currently visible on the
                  public website.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publishedTestimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-2xl border border-green-200 bg-white p-6 shadow-md"
                  >
                    {/* Status */}
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                      Published
                    </span>

                    {/* Name */}
                    <h3 className="mt-4 text-xl font-bold text-purple-950">
                      {testimonial.name}
                    </h3>

                    {testimonial.role && (
                      <p className="mt-1 text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    )}

                    {testimonial.event && (
                      <p className="mt-2 text-sm font-semibold text-blue-600">
                        {testimonial.event}
                      </p>
                    )}

                    {/* Rating */}
                    {testimonial.rating !== null && (
                      <div className="mt-4 text-lg text-amber-500">
                        {"★".repeat(
                          Math.max(
                            0,
                            Math.min(5, testimonial.rating)
                          )
                        )}
                        {"☆".repeat(
                          5 -
                            Math.max(
                              0,
                              Math.min(5, testimonial.rating)
                            )
                        )}
                      </div>
                    )}

                    {/* Review */}
                    <blockquote className="mt-4 leading-7 text-gray-700">
                      “{testimonial.review}”
                    </blockquote>

                    {/* Date */}
                    <p className="mt-4 text-xs text-gray-400">
                      Submitted:{" "}
                      {formatDate(testimonial.created_at)}
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          unpublishTestimonial(
                            testimonial.id
                          )
                        }
                        className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
                      >
                        Hide from Website
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTestimonial(testimonial.id)
                        }
                        className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete Review
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </div>
    </div>
  );
}

