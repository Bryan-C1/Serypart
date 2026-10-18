import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Calendar,
  ShoppingCart,
  Package,
  UserCog,
  Truck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import logoLight from "../../../assets/LogoSeryP.png";
import logoDark from "../../../assets/LogoSeryN.png";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", path: "/clientes", icon: Users },
  { name: "Vehículos", path: "/vehiculos", icon: Car },
  { name: "Servicios", path: "/servicios", icon: Wrench },
  { name: "Mecánicos", path: "/mecanicos", icon: UserCog },
  { name: "Agendamiento", path: "/agendamiento", icon: Calendar },
  { name: "Repuestos", path: "/repuestos", icon: Package },
  { name: "Proveedores", path: "/proveedores", icon: Truck },
  { name: "Ventas", path: "/ventas", icon: DollarSign },
  { name: "Compras", path: "/compras", icon: ShoppingCart },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={logoLight} alt="SeryPart" className="w-8 h-8 object-contain dark:hidden" />
            <img src={logoDark} alt="SeryPart" className="w-8 h-8 object-contain hidden dark:block" />
            <div>
              <h1 className="font-semibold">SeryPart</h1>
              <p className="text-xs text-muted-foreground">Taller Mecánico</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-sidebar-accent rounded"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@serypart.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}