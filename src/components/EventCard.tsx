interface EventCardProps {
  image: string;
  date: string;
  title: string;
  description: string;
  href?: string;
}

function EventCard({
  image,
  date,
  title,
  description,
  href = "/events",
}: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">

        <p className="text-sm font-semibold text-blue-600">
          {date}
        </p>

        <h3 className="mt-2 text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          {description}
        </p>

        <a
          href={href}
          className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
        >
          Learn More →
        </a>

      </div>

    </div>
  );
}

export default EventCard;