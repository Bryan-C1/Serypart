import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./features/admin/layout/AdminLayout";
import Login from "./features/auth/pages/Login";
import Registro from "./features/auth/pages/Registro";
import RecuperarPassword from "./features/auth/pages/RecuperarPassword";

import Landing from "./features/landing/pages/Landing";

import Dashboard from "./features/admin/dashboard/pages/DashboardPage";
import Clientes from "./features/admin/clientes/pages/ClientesPage";
import Vehiculos from "./features/admin/vehiculos/pages/VehiculosPage";
import Servicios from "./features/admin/servicios/pages/ServiciosPage";
import Mecanicos from "./features/admin/mecanicos/pages/MecanicosPage";
import Agendamiento from "./features/admin/agendamiento/pages/AgendamientoPage";
import Repuestos from "./features/admin/repuestos/pages/RepuestosPage";
import Proveedores from "./features/admin/proveedores/pages/ProveedoresPage";
import Ventas from "./features/admin/ventas/pages/VentasPage";
import Compras from "./features/admin/compras/pages/ComprasPage";
import Ganancias from "./features/admin/ganancias/pages/GananciasPage";
import RolesPage from "./features/admin/Roles/Pages/RolesPage";
import UsuariosPage from "./features/admin/Usuarios/Pages/UsuariosPage";
import NotificacionesPage from "./features/admin/notifications/pages/NotificacionesPage";
import SearchResultsPage from "./features/admin/global-search/pages/SearchResultsPage";
import SearchDetailPage from "./features/admin/global-search/pages/SearchDetailPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mecanicos" element={<Mecanicos />} />
          <Route path="/agendamiento" element={<Agendamiento />} />
          <Route path="/repuestos" element={<Repuestos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/ganancias" element={<Ganancias />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
          <Route path="/busqueda" element={<SearchResultsPage />} />
          <Route path="/busqueda/detalle/:type/:id" element={<SearchDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}