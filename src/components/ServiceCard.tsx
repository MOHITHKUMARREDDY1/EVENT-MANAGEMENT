interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

    </div>
  );
}

export default ServiceCard;