
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, Phone } from "lucide-react";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guests: string;
  message: string;
}

const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  event_type: "",
  event_date: "",
  guests: "",
  message: "",
};

export default function Booking() {
  const [formData, setFormData] =
    useState<BookingFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    const customerName = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!customerName) {
      setError("Please enter your full name.");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.event_type) {
      setError("Please select an event type.");
      return;
    }

    const guestsNumber =
      formData.guests.trim() === ""
        ? null
        : Number(formData.guests);

    if (
      guestsNumber !== null &&
      (!Number.isInteger(guestsNumber) || guestsNumber < 1)
    ) {
      setError(
        "Number of guests must be a whole number greater than zero."
      );
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        customer_name: customerName,
        name: customerName,
        email: email || null,
        phone,
        event_type: formData.event_type,
        event_date: formData.event_date || null,
        guests: guestsNumber,
        message: message || null,
        status: "pending",
      };

      const { error: insertError } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (insertError) {
        console.error("SUPABASE BOOKING ERROR:", insertError);

        setError(
          `Booking failed: ${insertError.message}`
        );

        return;
      }

      setSuccess(
        "Your booking request has been submitted successfully. Our team will contact you soon."
      );

      setFormData({ ...initialFormData });
    } catch (caughtError: unknown) {
      console.error("BOOKING UNEXPECTED ERROR:", caughtError);

      if (caughtError instanceof Error) {
        setError(
          `Something went wrong: ${caughtError.message}`
        );
      } else {
        setError(
          "Something went wrong while submitting your booking."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">

        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-amber-400">
            Let's Celebrate
          </p>

          <h1 className="mb-5 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Book Your Event
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-7 text-purple-100 md:text-lg">
            Tell us about your special occasion and let our team
            help you create a memorable celebration.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Information Card */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur md:p-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
              Event Planning
            </p>

            <h2 className="mb-5 text-3xl font-bold text-white">
              Let's plan something unforgettable.
            </h2>

            <p className="mb-8 leading-7 text-purple-100">
              Share your event requirements with us. We'll review
              your request and contact you to discuss the details,
              services and next steps.
            </p>

            <div className="space-y-5">

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Your Preferred Date
                  </h3>

                  <p className="mt-1 text-sm text-purple-200">
                    Tell us when you would like to celebrate.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Personalized Planning
                  </h3>

                  <p className="mt-1 text-sm text-purple-200">
                    We discuss your requirements and event vision.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Quick Response
                  </h3>

                  <p className="mt-1 text-sm text-purple-200">
                    Our team will contact you after reviewing your request.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="mb-2 text-sm text-purple-200">
                Prefer to contact us directly?
              </p>

              <a
                href="tel:+918985500481"
                className="inline-flex items-center gap-2 font-semibold text-amber-400 transition hover:text-amber-300"
              >
                <Phone size={18} />
                +91 8985500481
              </a>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-2xl md:p-9"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-purple-950">
                Event Details
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Please provide the basic details of your event.
              </p>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Full Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
              />
            </div>

            {/* Email + Phone */}
            <div className="mb-5 grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
                />
              </div>

            </div>

            {/* Event Type + Date */}
            <div className="mb-5 grid gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="event_type"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Event Type *
                </label>

                <select
                  id="event_type"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
                >
                  <option value="">Select event type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday Party">
                    Birthday Party
                  </option>
                  <option value="Engagement">
                    Engagement
                  </option>
                  <option value="Corporate Event">
                    Corporate Event
                  </option>
                  <option value="Anniversary">
                    Anniversary
                  </option>
                  <option value="Festival">Festival</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="event_date"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Preferred Event Date
                </label>

                <input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
                />
              </div>

            </div>

            {/* Guests */}
            <div className="mb-5">
              <label
                htmlFor="guests"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Expected Number of Guests
              </label>

              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                step="1"
                value={formData.guests}
                onChange={handleChange}
                placeholder="For example, 100"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Additional Details
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your venue, decoration, budget, theme, or other requirements."
                disabled={loading}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <strong>Booking Error:</strong> {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                aria-live="polite"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
              >
                {success}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </Button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Your booking request is not confirmed until our event
              management team contacts you.
            </p>

            <div className="mt-5 text-center">
              <Link
                to="/contact"
                className="text-sm font-semibold text-purple-900 hover:text-amber-600"
              >
                Have a question? Contact us
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

