// src/features/Auth/components/AuthLogo.jsx
import logoLight from "../../../assets/LogoSeryP.png";
import logoDark from "../../../assets/LogoSeryN.png";

export function AuthLogo() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div>
        <img src={logoLight} alt="SeryPart" className="w-14 h-14 object-contain dark:hidden" />
        <img src={logoDark} alt="SeryPart" className="w-14 h-14 object-contain hidden dark:block" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">SeryPart</h1>
        <p className="text-sm text-muted-foreground">Taller Mecánico</p>
      </div>
    </div>
  );
}