
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";

function Services() {
  return (
    <main>
      {/* =====================================================
          SERVICES HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-purple-950">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Dark Purple Overlay */}
        <div className="absolute inset-0 bg-purple-950/70" />

        {/* Gold Glow */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-center px-6 py-24 sm:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Our Services
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Everything You Need
              <span className="block text-amber-400">
                For Your Perfect Event
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
              From planning and decoration to entertainment and event
              coordination, we provide complete event management services
              for weddings, celebrations, corporate events, and special
              occasions.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/booking">
                Book Your Event
              </Button>

              <Button href="/contact" variant="secondary">
                Talk to Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            What We Offer
          </p>

          <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
            Complete Event Management Services
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-amber-500" />

          <p className="mt-6 leading-8 text-gray-600">
            We provide professional services to help you plan, organize,
            and execute memorable events. Whether it is a wedding,
            birthday, corporate function, conference, or special
            celebration, we help coordinate the important details so you
            can enjoy the occasion.
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN SERVICES
      ====================================================== */}
      <section className="bg-purple-50/50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Our Expertise"
            title="Services We Provide"
            description="Choose the services that match your event requirements."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon="💍"
              title="Wedding Events"
              description="Complete wedding planning and coordination to create a beautiful and memorable celebration."
            />

            <ServiceCard
              icon="🏢"
              title="Corporate Events"
              description="Professional planning for conferences, meetings, seminars, product launches, and corporate celebrations."
            />

            <ServiceCard
              icon="🎂"
              title="Birthday Parties"
              description="Creative birthday party planning with themes, decoration, entertainment, and event coordination."
            />

            <ServiceCard
              icon="🎤"
              title="Conferences"
              description="Organized conference management including venue coordination, scheduling, and guest arrangements."
            />

            <ServiceCard
              icon="🎨"
              title="Event Decoration"
              description="Creative decorations, themes, stage setups, and venue styling based on your event requirements."
            />

            <ServiceCard
              icon="🍽️"
              title="Catering"
              description="Food and beverage arrangements designed to match the style and requirements of your event."
            />

            <ServiceCard
              icon="📸"
              title="Photography"
              description="Event photography services to capture important moments and memorable experiences."
            />

            <ServiceCard
              icon="🎵"
              title="Entertainment"
              description="Entertainment arrangements including music, DJs, performances, and activities for your guests."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW OUR SERVICES WORK
      ====================================================== */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Simple Process"
            title="How We Manage Your Event"
            description="Our process is designed to keep your event organized from beginning to end."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Discuss
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We understand your event type, requirements, budget, and
                expectations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Design
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We create a suitable event plan, theme, and service
                arrangement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                03
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Organize
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We coordinate the required vendors, services, and event
                arrangements.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                04
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Deliver
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We manage the event execution and coordinate activities
                on the event day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICE HIGHLIGHT
      ====================================================== */}
      <section className="bg-purple-50/50 px-6 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="group overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
              alt="Event decoration and planning"
              className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Complete Planning
            </p>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              We Take Care of the Important Details
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Planning an event involves many different tasks. Our team
              helps coordinate the important parts so you can focus on
              enjoying your event.
            </p>

            {/* Features */}
            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                  ✓
                </span>

                <p className="text-gray-700">
                  Venue and event planning
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                  ✓
                </span>

                <p className="text-gray-700">
                  Decoration and theme setup
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                  ✓
                </span>

                <p className="text-gray-700">
                  Vendor and service coordination
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                  ✓
                </span>

                <p className="text-gray-700">
                  Event-day management
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button href="/contact">
                Request Event Planning
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative overflow-hidden bg-purple-950 px-6 py-20 sm:px-8">
        {/* Decorative glow */}
        <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Let's Create Something Special
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Have an Event in Mind?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-purple-100">
            Tell us what you are planning and send us your event
            requirements. We can help you organize your celebration.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/booking">
              Start Your Booking
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

export default Services;

