
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";

function About() {
  return (
    <main>
      {/* =====================================================
          ABOUT HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-purple-950">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Purple Overlay */}
        <div className="absolute inset-0 bg-purple-950/70" />

        {/* Decorative Glow */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-center px-6 py-24 sm:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              About Us
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Creating Moments
              <span className="block text-amber-400">
                Worth Remembering
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
              We plan, organize, and manage events that bring people
              together and create memorable experiences.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/booking">
                Book Your Event
              </Button>

              <Button href="/contact" variant="secondary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COMPANY INTRODUCTION
      ====================================================== */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="group overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
              alt="Event celebration"
              className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold text-purple-950 sm:text-4xl">
              Your Event, Our Responsibility
            </h2>

            <div className="mt-4 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-6 leading-8 text-gray-600">
              Event Management is focused on creating well-organized
              and memorable experiences for clients.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Every event is different. That's why we work closely with
              our clients to understand their ideas, requirements, budget,
              and expectations before planning the event.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From the first planning meeting to the final execution,
              our goal is to make the entire event experience simple,
              organized, and enjoyable.
            </p>

            <div className="mt-7">
              <Button href="/contact">
                Plan Your Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION & VISION
      ====================================================== */}
      <section className="bg-purple-50/50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Our Purpose"
            title="Mission & Vision"
            description="The principles that guide the way we plan and manage events."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                🎯
              </div>

              <h3 className="mt-6 text-2xl font-bold text-purple-950">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                Our mission is to provide organized, creative, and
                reliable event management services while understanding
                the unique requirements of every client.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                🚀
              </div>

              <h3 className="mt-6 text-2xl font-bold text-purple-950">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                Our vision is to create meaningful event experiences
                through thoughtful planning, creative ideas, and
                professional execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Our Approach"
            title="What We Focus On"
            description="We focus on the details that help make every event organized and memorable."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
              <div className="text-4xl">📋</div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Detailed Planning
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We carefully plan the important parts of your event
                before execution.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
              <div className="text-4xl">💡</div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Creative Ideas
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We develop creative concepts that match the theme and
                purpose of your event.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
              <div className="text-4xl">🤝</div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Client Focus
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We work closely with clients to understand their
                expectations and requirements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
              <div className="text-4xl">⏱️</div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Smooth Execution
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We coordinate different event activities to help
                everything run smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EVENT PLANNING PROCESS
      ====================================================== */}
      <section className="bg-purple-50/50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="How We Work"
            title="Our Event Planning Process"
            description="A simple process helps us turn your event idea into reality."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Understand
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We discuss your event requirements, ideas, and
                expectations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Plan
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We prepare the event plan, schedule, and required
                arrangements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                03
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Coordinate
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We coordinate vendors, services, and event activities.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-950 text-xl font-bold text-amber-400 shadow-lg transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                04
              </div>

              <h3 className="mt-5 text-xl font-bold text-purple-950">
                Execute
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We manage the event and help ensure everything is
                executed according to plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR COMMITMENT
      ====================================================== */}
      <section className="bg-purple-950 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Our Commitment
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Your Celebration Deserves Attention to Detail
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-purple-100">
            Every event has its own requirements. We focus on
            understanding those requirements and coordinating the
            planning, services, and execution around your event.
          </p>
        </div>
      </section>

      {/* =====================================================
          CTA SECTION
      ====================================================== */}
      <section className="relative overflow-hidden bg-purple-50 px-6 py-20 sm:px-8">
        <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Let's Create Something Memorable
          </p>

          <h2 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl lg:text-5xl">
            Have an Event in Mind?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Tell us your requirements and let's start planning your
            special occasion.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/booking">
              Start Your Booking
            </Button>

            <Button href="/contact" variant="dark">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;

