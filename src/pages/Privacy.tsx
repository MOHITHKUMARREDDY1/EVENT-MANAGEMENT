
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-purple-950 px-4 py-20 text-center text-white">
        <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-amber-400">
          Legal Information
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">
          Privacy Policy
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-purple-200">
          Information about how we handle information submitted
          through our event management website.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-8 rounded-3xl bg-white p-6 shadow-lg md:p-10">

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Information We Collect
            </h2>

            <p className="leading-7 text-gray-600">
              When you submit a booking request, contact form,
              or testimonial, we may collect the information
              you provide, such as your name, phone number,
              email address, event details, and message.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              How We Use Information
            </h2>

            <p className="leading-7 text-gray-600">
              Information submitted through the website may be
              used to respond to enquiries, discuss event
              requirements, process booking requests, and provide
              event-related communication.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Testimonials
            </h2>

            <p className="leading-7 text-gray-600">
              Testimonials submitted through the website may be
              reviewed before being displayed publicly on the
              website.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Data Security
            </h2>

            <p className="leading-7 text-gray-600">
              We take reasonable steps to protect information
              submitted through the website. However, no online
              system can guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Contact
            </h2>

            <p className="leading-7 text-gray-600">
              If you have questions about this privacy policy,
              please contact us using the contact information
              provided on the website.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Link
              to="/"
              className="font-semibold text-purple-900 hover:text-amber-600"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

