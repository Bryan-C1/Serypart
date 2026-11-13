// src/features/Auth/components/AuthLogo.jsx
import logoLight from "../../../assets/LogoSeryP.png";
import logoDark from "../../../assets/LogoSeryN.png";

export function AuthLogo() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="flex shrink-0 items-center justify-center rounded-full bg-transparent">
        <img src={logoLight} alt="SeryPart" className="h-12 w-12 object-contain dark:hidden" />
        <img src={logoDark} alt="SeryPart" className="hidden h-12 w-12 object-contain dark:block" />
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">SeryPart</h1>
        <p className="text-sm font-medium text-[#4b5563]">Taller Mecánico</p>
      </div>
    </div>
  );
}