
import { useEffect, useState } from "react";
import { X, Images, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id, title, image_url, category, description, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("PUBLIC GALLERY ERROR:", error);
        setError("Unable to load the gallery. Please try again later.");
        setLoading(false);
        return;
      }

      setGallery(data ?? []);
      setLoading(false);
    };

    void fetchGallery();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              <Images className="h-4 w-4" />
              Our Portfolio
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Moments Worth
              <span className="text-amber-400"> Remembering</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-purple-100">
              Explore celebrations, weddings, corporate events, and
              special moments captured through our event experiences.
            </p>

            <div className="mt-8">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
              >
                Plan Your Event
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Our Work
            </span>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              Explore Our Gallery
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Discover the celebrations and experiences we've helped
              bring to life.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-900" />

              <p className="mt-5 text-gray-600">
                Loading gallery images...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700"
            >
              <p className="font-semibold">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && gallery.length === 0 && (
            <div className="rounded-3xl border border-purple-100 bg-purple-50 px-6 py-16 text-center">
              <Images className="mx-auto h-14 w-14 text-purple-300" />

              <h2 className="mt-5 text-2xl font-bold text-purple-950">
                Gallery Coming Soon
              </h2>

              <p className="mx-auto mt-3 max-w-md text-gray-600">
                New event photos will appear here when they are
                published.
              </p>

              <Link
                to="/booking"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-purple-950 px-6 py-3 font-semibold text-white transition hover:bg-purple-900"
              >
                Plan an Event
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Gallery cards */}
          {!loading && !error && gallery.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => setSelectedImage(item)}
                    className="relative block w-full overflow-hidden bg-purple-100 text-left"
                    aria-label={`View ${item.title}`}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-purple-950/0 transition group-hover:bg-purple-950/30">
                      <span className="rounded-full bg-white/0 px-5 py-2 font-semibold text-white opacity-0 shadow-lg transition group-hover:bg-white/95 group-hover:text-purple-950 group-hover:opacity-100">
                        View Image
                      </span>
                    </div>
                  </button>

                  {/* Content */}
                  <div className="p-6">
                    {item.category && (
                      <p className="text-sm font-bold uppercase tracking-wide text-amber-600">
                        {item.category}
                      </p>
                    )}

                    <h2 className="mt-2 text-xl font-bold text-purple-950">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mt-3 leading-7 text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-50 px-6 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Create Your Own Memories
          </span>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
            Planning Your Own Event?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Tell us about your celebration and let's start planning
            something memorable.
          </p>

          <Link
            to="/booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-purple-950 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-900"
          >
            Book an Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
              aria-label="Close image"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />

            <div className="p-5">
              {selectedImage.category && (
                <p className="text-sm font-bold uppercase tracking-wide text-amber-600">
                  {selectedImage.category}
                </p>
              )}

              <h2 className="mt-1 text-xl font-bold text-purple-950">
                {selectedImage.title}
              </h2>

              {selectedImage.description && (
                <p className="mt-2 text-gray-600">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;

