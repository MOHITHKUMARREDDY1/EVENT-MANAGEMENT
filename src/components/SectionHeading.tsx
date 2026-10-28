interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
}

function SectionHeading({
  label,
  title,
  description,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl"
      }
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        {label}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-7 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;