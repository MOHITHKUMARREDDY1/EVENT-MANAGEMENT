
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: subject.trim() || null,
        message: message.trim(),
      });

    if (error) {
      console.error("CONTACT FORM ERROR:", error);

      setError(
        "Unable to send your message right now. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setSuccess(
      "Thank you for contacting us. Your message has been received."
    );

    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-gray-950 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              Get In Touch
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Let's Create Something
              <span className="text-amber-400"> Memorable</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-purple-100">
              Have an event in mind? Tell us what you are planning and
              we'll help you take the next step.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          {/* CONTACT INFORMATION */}
          <div className="lg:col-span-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Contact Details
            </span>

            <h2 className="mt-3 text-3xl font-bold text-purple-950">
              We'd Love to Hear From You
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you are planning a wedding, celebration, corporate
              event, or another special occasion, get in touch with us.
            </p>

            <div className="mt-8 space-y-4">
              {/* PHONE */}
              <a
                href="tel:+918985500481"
                className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5 transition hover:border-purple-200 hover:shadow-md"
              >
                <div className="rounded-xl bg-purple-950 p-3 text-white">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-bold text-purple-950">
                    +91 8985500481
                  </p>
                </div>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:bandimohithkumarreddy@gmail.com"
                className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5 transition hover:border-purple-200 hover:shadow-md"
              >
                <div className="rounded-xl bg-purple-950 p-3 text-white">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-bold text-purple-950">
                    bandimohithkumarreddy@gmail.com
                  </p>
                </div>
              </a>

              {/* LOCATION */}
              <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <div className="rounded-xl bg-purple-950 p-3 text-white">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Service Area
                  </p>

                  <p className="mt-1 font-bold text-purple-950">
                    Event Management Services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-purple-950 sm:text-3xl">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-gray-600">
                  Fill in the form below and we'll receive your enquiry.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-purple-950"
                  >
                    Name *
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-purple-950"
                  >
                    Email *
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-2 block text-sm font-semibold text-purple-950"
                  >
                    Phone
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-semibold text-purple-950"
                  >
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What would you like to discuss?"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <div className="mt-6">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-purple-950"
                >
                  Message *
                </label>

                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event or enquiry..."
                  required
                  rows={7}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <p className="text-sm font-medium">
                    {success}
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-950 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Sending..." : "Send Message"}

                {!submitting && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-50 px-6 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Ready to Begin?
          </span>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
            Have a Specific Event in Mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            If you're ready to share your event requirements, you can
            submit a booking request directly.
          </p>

          <a
            href="/booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-white transition hover:bg-amber-600"
          >
            Book Your Event
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}

export default Contact;

