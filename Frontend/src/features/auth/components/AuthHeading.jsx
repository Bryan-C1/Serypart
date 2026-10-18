// src/features/Auth/components/AuthHeading.jsx
export function AuthHeading({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
    </div>
  );
}