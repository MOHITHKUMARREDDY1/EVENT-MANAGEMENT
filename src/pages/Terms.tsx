
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-purple-950 px-4 py-20 text-center text-white">
        <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-amber-400">
          Legal Information
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-purple-200">
          General terms for using our event management website
          and submitting event enquiries.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-8 rounded-3xl bg-white p-6 shadow-lg md:p-10">

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Website Use
            </h2>

            <p className="leading-7 text-gray-600">
              This website provides information about event
              management services and allows visitors to submit
              enquiries, booking requests, and testimonials.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Booking Requests
            </h2>

            <p className="leading-7 text-gray-600">
              Submitting a booking request does not automatically
              confirm an event. A booking becomes confirmed only
              after the event management team contacts the customer
              and confirms the required arrangements.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Customer Information
            </h2>

            <p className="leading-7 text-gray-600">
              Visitors should provide accurate information when
              submitting booking and contact forms.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Testimonials
            </h2>

            <p className="leading-7 text-gray-600">
              Submitted testimonials may be reviewed before
              publication. The website administrator may choose
              whether a submitted testimonial is displayed.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Service Information
            </h2>

            <p className="leading-7 text-gray-600">
              Event requirements, availability, pricing, venues,
              packages, and other arrangements may vary depending
              on the specific event.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-purple-950">
              Changes
            </h2>

            <p className="leading-7 text-gray-600">
              Website content and these terms may be updated when
              necessary.
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

