// src/features/Auth/components/TextField.jsx
export function TextField({
  label,
  icon: Icon,
  hint,
  rightSlot,
  wrapperClassName = "",
  placeholderClassName = "",
  id,
  ...inputProps
}) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="mb-2 block text-[1.06rem] font-medium text-[#1f2937]">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />}
        <input
          id={id}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} ${rightSlot ? "pr-12" : "pr-4"} border border-[#cad7ea] bg-[#dfeaf6] py-3 text-[1.05rem] text-[#111827] placeholder:text-[#7a8ea5] shadow-inner shadow-[#edf3fb] outline-none transition-all duration-200 focus:border-[#94a3b8] focus:ring-2 focus:ring-[#b9d9ff] ${placeholderClassName}`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {hint && <p className="mt-2 text-xs text-[#6b7280]">{hint}</p>}
    </div>
  );
}