
import { useEffect, useState } from "react";
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
}

function DatabaseTest() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getEvents() {
      console.log("Starting Supabase request...");

      const result = await supabase
        .from("events")
        .select("*");

      console.log("Supabase result:", result);
      console.log("Events received:", result.data);

      if (result.error) {
        console.error("Supabase error:", result.error);
        setError(result.error.message);
      } else {
        setEvents(result.data || []);
      }

      setLoading(false);
    }

    getEvents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading events...
        </h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-red-600">
            Database Error
          </h1>

          <p className="mt-4 text-gray-700">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-4xl font-bold text-gray-900">
          Events from Supabase
        </h1>

        <p className="mt-4 text-gray-600">
          This page is reading event data directly
          from your Supabase database.
        </p>

        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <p className="font-semibold text-blue-900">
            Events received: {events.length}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              No events found
            </h2>

            <p className="mt-3 text-gray-600">
              Supabase returned zero events.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {events.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >

                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">

                  <p className="text-sm font-semibold text-blue-600">
                    {event.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {event.title}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-500">

                    <p>
                      Date: {event.event_date}
                    </p>

                    <p>
                      Location: {event.location}
                    </p>

                    <p>
                      Status: {event.status}
                    </p>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default DatabaseTest;

