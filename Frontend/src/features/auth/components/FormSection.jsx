
export function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-auth-primary" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}