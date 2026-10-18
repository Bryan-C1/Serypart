// src/features/Auth/components/SubmitButton.jsx
export function SubmitButton({ children, ...props }) {
  return (
    <button
      type="submit"
      className="w-full py-3 bg-auth-primary text-auth-primary-foreground rounded-lg hover:bg-auth-secondary transition-colors font-medium"
      {...props}
    >
      {children}
    </button>
  );
}