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
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id={id}
          className={`w-full pl-10 ${rightSlot ? "pr-12" : "pr-4"} py-3 bg-input-background border border-border rounded-lg text-gray-900 placeholder:text-muted-foreground ${placeholderClassName} focus:outline-none focus:ring-2 focus:ring-ring`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}