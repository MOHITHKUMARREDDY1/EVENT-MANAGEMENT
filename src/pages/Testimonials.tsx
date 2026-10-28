import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle,
  MessageSquareQuote,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
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

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [event, setEvent] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select(
          "id, name, role, event, review, rating, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Loading testimonials failed:", error);
        setTestimonials([]);
        return;
      }

      setTestimonials(data ?? []);
    } catch (err) {
      console.error("Unexpected loading error:", err);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!name.trim() || !review.trim()) {
      setError("Please enter your name and review.");
      return;
    }

    if (review.trim().length < 5) {
      setError("Your review must contain at least 5 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from("testimonials")
        .insert({
          name: name.trim(),
          role: role.trim() || null,
          event: event.trim() || null,
          review: review.trim(),
          rating,
          is_published: false,
        });

      if (insertError) {
        console.error("Supabase review error:", insertError);
        setError(
          `Unable to submit review: ${insertError.message}` +
            (insertError.code ? ` (Code: ${insertError.code})` : "")
        );
        return;
      }

      setSuccess(
        "Thank you! Your review was submitted successfully and is waiting for admin approval."
      );

      setName("");
      setRole("");
      setEvent("");
      setReview("");
      setRating(5);
    } catch (err) {
      console.error("Unexpected review submission error:", err);
      setError(
        err instanceof Error
          ? `Unable to submit review: ${err.message}`
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              <MessageSquareQuote className="h-4 w-4" />
              Client Experiences
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Experiences That
              <span className="text-amber-400"> Matter</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-purple-100">
              Read experiences shared by people who have trusted us with
              their special occasions.
            </p>

            <Link
              to="/booking"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
            >
              Plan Your Event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Reviews
            </span>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              What Our Clients Say
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Genuine feedback shared by our customers.
            </p>
          </div>

          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-900" />
              <p className="mt-5 text-gray-600">Loading reviews...</p>
            </div>
          )}

          {!loading && testimonials.length === 0 && (
            <div className="rounded-3xl border border-purple-100 bg-purple-50 px-6 py-16 text-center">
              <MessageSquareQuote className="mx-auto h-14 w-14 text-purple-300" />
              <h3 className="mt-5 text-2xl font-bold text-purple-950">
                Be the First to Share Your Experience
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-gray-600">
                We would love to hear about your experience with our event
                management services.
              </p>
            </div>
          )}

          {!loading && testimonials.length > 0 && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < (item.rating ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-5 text-lg leading-8 text-gray-700">
                    “{item.review}”
                  </p>

                  <div className="mt-7 border-t border-gray-100 pt-5">
                    <p className="font-bold text-purple-950">{item.name}</p>

                    {item.role && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.role}
                      </p>
                    )}

                    {item.event && (
                      <p className="mt-2 text-sm font-semibold text-amber-600">
                        {item.event}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-purple-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Share Your Experience
            </span>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              Leave a Review
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
              Tell us about your experience. Your review will be published
              after it has been reviewed.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="testimonial-name"
                  className="mb-2 block text-sm font-semibold text-purple-950"
                >
                  Your Name *
                </label>
                <input
                  id="testimonial-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="testimonial-role"
                  className="mb-2 block text-sm font-semibold text-purple-950"
                >
                  Role / Relationship
                </label>
                <input
                  id="testimonial-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Example: Client"
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="testimonial-event"
                className="mb-2 block text-sm font-semibold text-purple-950"
              >
                Event
              </label>
              <input
                id="testimonial-event"
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="Example: Wedding Event"
                maxLength={150}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-purple-950">
                Your Rating
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Give ${value} star rating`}
                    aria-pressed={rating === value}
                    className="rounded-lg p-1"
                  >
                    <Star
                      className={`h-7 w-7 transition ${
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="testimonial-review"
                className="mb-2 block text-sm font-semibold text-purple-950"
              >
                Your Review *
              </label>
              <textarea
                id="testimonial-review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                required
                minLength={5}
                maxLength={2000}
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {success && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-950 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Reviews are submitted for approval before appearing publicly.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}