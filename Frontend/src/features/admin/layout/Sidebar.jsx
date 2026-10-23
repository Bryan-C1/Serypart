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
  ShieldCheck,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoDark from "../../../assets/LogoSeryN.png";
import { getCurrentUser, getUserInitials } from "../../../shared/utils/currentUser";
import { CustomScrollbar } from "../../../shared/ui/CustomScrollbar";

const navigationGroups = [
  {
    label: "Principal",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Clientes",
    icon: Users,
    items: [
      { name: "Clientes", path: "/clientes", icon: Users },
      { name: "Vehículos", path: "/vehiculos", icon: Car },
    ],
  },
  {
    label: "Taller",
    icon: Wrench,
    items: [
      { name: "Servicios", path: "/servicios", icon: Wrench },
      { name: "Mecánicos", path: "/mecanicos", icon: UserCog },
      { name: "Agendamiento", path: "/agendamiento", icon: Calendar },
    ],
  },
  {
    label: "Inventario",
    icon: Package,
    items: [
      { name: "Repuestos", path: "/repuestos", icon: Package },
      { name: "Compras", path: "/compras", icon: ShoppingCart },
      { name: "Proveedores", path: "/proveedores", icon: Truck },
    ],
  },
  {
    label: "Finanzas",
    icon: DollarSign,
    items: [
      { name: "Ventas", path: "/ventas", icon: DollarSign },
    ],
  },
  {
    label: "Administración",
    icon: ShieldCheck,
    items: [
      { name: "Roles", path: "/roles", icon: ShieldCheck },
      { name: "Usuarios", path: "/usuarios", icon: UserCircle },
    ],
  },
];

function groupContainingPath(pathname) {
  const group = navigationGroups.find((g) => g.items.some((item) => item.path === pathname));
  return group?.label;
}

export function Sidebar() {
  const location = useLocation();
  const navRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [currentUser] = useState(getCurrentUser);
  const userEmail = currentUser?.email || "admin@serypart.com";
  const [openGroups, setOpenGroups] = useState(() => {
    const active = groupContainingPath(location.pathname);
    return active ? [active] : [];
  });

  const toggleGroup = (label) => {
    setOpenGroups((current) => (current.includes(label) ? [] : [label]));
  };

  useEffect(() => {
    const active = groupContainingPath(location.pathname);
    if (active) setOpenGroups([active]);
  }, [location.pathname]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateCollapsedState = (event) => setIsCollapsed(event.matches);
    mobileQuery.addEventListener("change", updateCollapsedState);
    return () => mobileQuery.removeEventListener("change", updateCollapsedState);
  }, []);

  return (
    <aside
      className={`shrink-0 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={logoDark} alt="SeryPart" className="w-14 h-14 object-contain" />
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

      <div className="relative flex-1 min-h-0">
      <nav ref={navRef} className="hide-scrollbar h-full overflow-y-auto p-2 pr-3">
        <div className="space-y-1">
          {navigationGroups.map((group) => {
            const isOpen = isCollapsed || openGroups.includes(group.label);

            return (
              <div key={group.label}>
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-base font-medium tracking-wide text-sidebar-foreground hover:text-sidebar-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <group.icon className="w-4 h-4" />
                      {group.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                    />
                  </button>
                )}
                {isOpen && (
                  <ul className={isCollapsed ? "space-y-1" : "space-y-1 ml-3 border-l border-sidebar-border pl-2"}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-2"} py-2 rounded-md transition-colors ${
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                            title={isCollapsed ? item.name : undefined}
                          >
                            {isCollapsed ? <Icon className="w-5 h-5" /> : <span className="text-sm">{item.name}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>
      <CustomScrollbar containerRef={navRef} />
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{getUserInitials(currentUser)}</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.name || userEmail}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
          )}
        </div>
      </div>
    </aside>
  );
}