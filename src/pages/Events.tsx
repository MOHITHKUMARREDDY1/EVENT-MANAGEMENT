
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

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

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, slug, description, category, event_date, location, image_url, status"
        )
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Events loading error:", error);
        setError("Unable to load events right now.");
        setEvents([]);
      } else {
        setEvents(data ?? []);
      }

      setLoading(false);
    }

    loadEvents();
  }, []);

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

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              Our Events
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Events Designed to Be
              <span className="text-amber-400"> Remembered</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-purple-100 md:text-xl">
              Explore the events we plan, coordinate, and manage with
              creativity, attention to detail, and professional execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
              >
                Plan Your Event
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Explore
          </span>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 md:text-4xl">
            Upcoming & Featured Events
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover the events available through our event management
            services.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-900" />

            <p className="mt-4 text-gray-600">
              Loading events...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <p className="mt-2 text-sm text-red-600">
              Please check your Supabase connection and try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-purple-100 bg-purple-50 px-6 py-16 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-purple-300" />

            <h3 className="mt-5 text-xl font-bold text-purple-950">
              No events available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-600">
              New events will appear here once they are added to the
              event management system.
            </p>

            <Link
              to="/booking"
              className="mt-6 inline-block rounded-full bg-purple-950 px-6 py-3 font-semibold text-white transition hover:bg-purple-900"
            >
              Plan an Event
            </Link>
          </div>
        )}

        {/* Event cards */}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-purple-100">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-950 to-purple-800">
                      <CalendarDays className="h-16 w-16 text-amber-300/70" />
                    </div>
                  )}

                  {event.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-purple-900 shadow-sm">
                      {event.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-purple-950">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="mt-3 line-clamp-3 leading-7 text-gray-600">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                      <span>
                        {formatDate(event.event_date)}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/events/${event.slug}`}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-purple-900 transition hover:text-amber-600"
                  >
                    View Event Details
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Start Planning
          </span>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 md:text-4xl">
            Have an Event in Mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Tell us about your event and let us help you turn your ideas
            into a memorable celebration.
          </p>

          <Link
            to="/booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-purple-950 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-900"
          >
            Book Your Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

