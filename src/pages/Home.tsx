
import { useEffect, useState } from "react";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import EventCard from "../components/EventCard";
import { supabase } from "../lib/supabase";

interface EventItem {
  id: string | number;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
}

interface Testimonial {
  id: string | number;
  name: string;
  role: string | null;
  review: string;
  rating: number | null;
}

interface GalleryItem {
  id: string | number;
  title: string | null;
  image_url: string;
}

function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      // Load upcoming events
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("id, title, description, event_date, image_url")
        .order("event_date", { ascending: true })
        .limit(3);

      if (eventError) {
        console.error("HOME EVENTS ERROR:", eventError);
      } else {
        setEvents(eventData ?? []);
      }

      // Load approved testimonials
      const { data: testimonialData, error: testimonialError } =
        await supabase
          .from("testimonials")
          .select("id, name, role, review, rating")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3);

      if (testimonialError) {
        console.error(
          "HOME TESTIMONIALS ERROR:",
          testimonialError
        );
      } else {
        setTestimonials(testimonialData ?? []);
      }

      // Load gallery images
      const { data: galleryData, error: galleryError } =
        await supabase
          .from("gallery")
          .select("id, title, image_url")
          .order("created_at", { ascending: false })
          .limit(4);

      if (galleryError) {
        console.error("HOME GALLERY ERROR:", galleryError);
      } else {
        setGallery(galleryData ?? []);
      }
    };

    void loadHomeData();
  }, []);

  const formatEventDate = (date: string | null) => {
    if (!date) {
      return "Date to be announced";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main>
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-purple-950/75" />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/70 to-purple-950/20" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center rounded-full border border-amber-400/40 bg-black/20 px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 sm:text-sm">
                Event Management & Planning
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              We Create Events
              <span className="block text-amber-400">
                You&apos;ll Never Forget
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg lg:text-xl">
              Professional event planning, decoration, entertainment,
              and complete event management for weddings, corporate
              events, celebrations, and special occasions.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button href="/booking">
                Book Your Event
              </Button>

              <Button href="/events" variant="secondary">
                Explore Events
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-purple-100">
              <span>✓ Professional Planning</span>
              <span>✓ Complete Coordination</span>
              <span>✓ Memorable Experiences</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES SECTION
      ====================================================== */}
      <section className="bg-white px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="What We Do"
            title="Our Event Services"
            description="Professional event planning and management services designed for every occasion."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon="💍"
              title="Weddings"
              description="Beautifully planned weddings with attention to every important detail."
            />

            <ServiceCard
              icon="🏢"
              title="Corporate Events"
              description="Professional conferences, meetings, launches and corporate celebrations."
            />

            <ServiceCard
              icon="🎂"
              title="Birthday Parties"
              description="Fun and memorable birthday celebrations customized to your requirements."
            />

            <ServiceCard
              icon="🎊"
              title="Special Events"
              description="Complete planning for festivals, anniversaries and other special occasions."
            />
          </div>

          <div className="mt-10 text-center">
            <a
              href="/services"
              className="font-semibold text-purple-800 transition hover:text-amber-600"
            >
              View All Services →
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          UPCOMING EVENTS
      ====================================================== */}
      <section className="bg-gray-50 px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              label="What&apos;s Coming"
              title="Upcoming Events"
              description="Discover events and celebrations managed through our platform."
              centered={false}
            />

            <a
              href="/events"
              className="font-semibold text-purple-800 transition hover:text-amber-600"
            >
              View All Events →
            </a>
          </div>

          {events.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  image={
                    event.image_url ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
                  }
                  date={formatEventDate(event.event_date)}
                  title={event.title}
                  description={
                    event.description ||
                    "Event details will be available soon."
                  }
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                Upcoming events will appear here soon.
              </p>

              <div className="mt-5">
                <Button href="/events" variant="dark">
                  Explore Events
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          ABOUT SECTION
      ====================================================== */}
      <section className="bg-white px-6 py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              About Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              Turning Your Ideas Into Memorable Experiences
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              We are an event management team dedicated to creating
              meaningful and memorable experiences. Our team works
              closely with clients to understand their vision and
              transform it into a successful event.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From planning and decoration to coordination and
              execution, we take care of every important detail.
            </p>

            <div className="mt-7">
              <Button href="/about" variant="dark">
                Learn More About Us
              </Button>
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80"
              alt="Professional event planning"
              className="h-[450px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY SECTION
      ====================================================== */}
      <section className="bg-gray-50 px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Our Work"
            title="Event Gallery"
            description="A glimpse of the celebrations and experiences we help create."
          />

          {gallery.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.title || "Event gallery image"}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 md:h-64"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-600">
                Our event gallery will appear here soon.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href="/gallery"
              className="font-semibold text-purple-800 transition hover:text-amber-600"
            >
              View Full Gallery →
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS SECTION
      ====================================================== */}
      <section className="bg-white px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Client Reviews"
            title="What Our Clients Say"
            description="Reviews shared by customers who have experienced our event services."
          />

          {testimonials.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {testimonial.rating !== null && (
                    <div
                      className="text-lg text-amber-500"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
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

                  <p className="mt-5 leading-7 text-gray-600">
                    &quot;{testimonial.review}&quot;
                  </p>

                  <h3 className="mt-5 font-bold text-purple-950">
                    {testimonial.name}
                  </h3>

                  {testimonial.role && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-gray-600">
                Customer reviews will appear here after they
                are approved.
              </p>

              <div className="mt-5">
                <Button href="/testimonials" variant="dark">
                  Share Your Experience
                </Button>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href="/testimonials"
              className="font-semibold text-purple-800 transition hover:text-amber-600"
            >
              View All Reviews →
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          CALL TO ACTION
      ====================================================== */}
      <section className="relative overflow-hidden bg-purple-950 px-6 py-20 lg:py-24">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Let&apos;s Celebrate
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Ready to Plan Your Next Event?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-purple-100">
            Tell us about your event and let our team help you
            turn your ideas into an unforgettable experience.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/booking">
              Get Started
            </Button>

            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

