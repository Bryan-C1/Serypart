// src/features/Auth/components/AuthLayout.jsx
import { AuthLogo } from "./AuthLogo";

export function AuthLayout({ children, aside, maxWidth = "max-w-[31rem]" }) {
  return (
    <div className="min-h-screen bg-[#d9d0e7] p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[22px] border border-[#cdc3dd] bg-[#f1f1f1] shadow-[0_16px_36px_rgba(34,30,50,0.08)] lg:min-h-[calc(100vh-3rem)]">
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 md:px-10 lg:px-12">
          <div className={`w-full ${maxWidth}`}>
            <AuthLogo />
            {children}
          </div>
        </div>
        <div className="hidden lg:block lg:w-[54%] xl:w-[52%]">{aside}</div>
      </div>
    </div>
  );
}