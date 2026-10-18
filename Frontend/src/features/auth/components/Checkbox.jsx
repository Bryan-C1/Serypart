// src/features/Auth/components/Checkbox.jsx
export function Checkbox({ children, align = "center", id, ...props }) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer text-sm ${
        align === "start" ? "items-start gap-3" : "items-center gap-2"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className={`w-4 h-4 rounded border-border text-auth-primary focus:ring-2 focus:ring-ring ${
          align === "start" ? "mt-1" : ""
        }`}
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}