import { useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CustomScrollbar } from "../../../shared/ui/CustomScrollbar";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../shared/services/api";

export function AdminLayout() {
  const mainRef = useRef(null);
  const location = useLocation();

  if (!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <Header />
        <div className="relative flex-1 min-h-0">
          <main ref={mainRef} className="hide-scrollbar h-full overflow-y-auto bg-background p-6 pr-8">
            <Outlet />
          </main>
          <CustomScrollbar containerRef={mainRef} />
        </div>
      </div>
    </div>
  );
}