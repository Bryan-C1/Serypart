// src/features/Auth/components/SubmitButton.jsx
export function SubmitButton({ children, ...props }) {
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-[#0d6efd] py-3 text-base font-semibold text-white shadow-[0_8px_18px_rgba(13,110,253,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#0b5ed7] disabled:cursor-not-allowed disabled:opacity-70"
      {...props}
    >
      {children}
    </button>
  );
}