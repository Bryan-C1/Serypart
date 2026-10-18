export default function SectionHeading({ eyebrow, title, subtitle, dark = false }) {
  return (
    <div className="text-center mb-16">
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: "#2563EB" }}
      >
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold mb-4" style={{ color: dark ? "#FFFFFF" : "#111111" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg max-w-xl mx-auto" style={{ color: dark ? "#9CA3AF" : "#6B7280" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}