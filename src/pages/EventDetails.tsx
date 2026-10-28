
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import supabase from "../lib/supabase";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  status: string | null;
}

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      if (!slug) {
        setError("Event was not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, slug, description, category, event_date, location, image_url, status"
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Event details error:", error);
        setError("Unable to load this event.");
        setEvent(null);
      } else if (!data) {
        setError("This event does not exist.");
        setEvent(null);
      } else {
        setEvent(data);
      }

      setLoading(false);
    }

    loadEvent();
  }, [slug]);

  function formatDate(date: string | null) {
    if (!date) return "Date to be announced";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-900" />

            <p className="mt-5 text-gray-600">
              Loading event details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-100 transition hover:text-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>

            <h1 className="mt-8 text-4xl font-bold md:text-6xl">
              Event Not Found
            </h1>

            <p className="mt-5 max-w-xl text-lg text-purple-100">
              {error || "We could not find the event you requested."}
            </p>

            <Link
              to="/events"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
            >
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-100 transition hover:text-amber-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </section>

      {/* Event details */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl bg-purple-100 shadow-xl">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="h-[350px] w-full object-cover md:h-[500px]"
              />
            ) : (
              <div className="flex h-[350px] items-center justify-center bg-gradient-to-br from-purple-950 to-purple-800 md:h-[500px]">
                <CalendarDays className="h-24 w-24 text-amber-300/70" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            {event.category && (
              <span className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-amber-700">
                {event.category}
              </span>
            )}

            <h1 className="mt-5 text-4xl font-bold leading-tight text-purple-950 md:text-5xl">
              {event.title}
            </h1>

            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-purple-50 p-5">
                <CalendarDays className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Event Date
                  </p>

                  <p className="mt-1 font-semibold text-purple-950">
                    {formatDate(event.event_date)}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-4 rounded-2xl bg-purple-50 p-5">
                  <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Location
                    </p>

                    <p className="mt-1 font-semibold text-purple-950">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-purple-950">
                  About This Event
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                  {event.description}
                </p>
              </div>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
              >
                Book Your Event
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-purple-900 px-7 py-3.5 font-semibold text-purple-950 transition hover:bg-purple-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Make It Memorable
          </span>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 md:text-4xl">
            Ready to Plan Your Event?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Share your event requirements with us and let's start planning
            something memorable.
          </p>

          <Link
            to="/booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-purple-950 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-900"
          >
            Start Planning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

