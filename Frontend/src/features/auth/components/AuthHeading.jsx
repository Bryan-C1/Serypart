// src/features/Auth/components/AuthHeading.jsx
export function AuthHeading({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-[3rem] font-black leading-[1.05] tracking-[-0.06em] text-[#111827]">{title}</h2>
      {subtitle && <p className="mt-2 text-[1.05rem] font-normal text-[#6b7280]">{subtitle}</p>}
    </div>
  );
}