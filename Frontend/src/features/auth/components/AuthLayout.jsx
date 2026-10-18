// src/features/Auth/components/AuthLayout.jsx
import { AuthLogo } from "./AuthLogo";

export function AuthLayout({ children, aside, maxWidth = "max-w-md" }) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className={`w-full ${maxWidth}`}>
          <AuthLogo />
          {children}
        </div>
      </div>
      {aside}
    </div>
  );
}