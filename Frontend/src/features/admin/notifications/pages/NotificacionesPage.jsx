import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "../data/notifications";

const categories = ["Todas", "Principal", "Clientes", "Taller", "Inventario", "Finanzas", "Administración"];

export default function NotificacionesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filteredNotifications = notifications.filter((notification) => {
    const searchableText = `${notification.title} ${notification.message} ${notification.category}`.toLowerCase();
    const matchesSearch = searchableText.includes(search.toLowerCase());
    const matchesCategory = category === "Todas" || notification.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Notificaciones</h1>
            <p className="mt-1 text-muted-foreground">Consulta y filtra todas tus notificaciones.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar notificaciones</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar notificaciones..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filtrar por:</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-foreground outline-none focus:border-primary"
          >
            {categories.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredNotifications.length} {filteredNotifications.length === 1 ? "notificación encontrada" : "notificaciones encontradas"}
        </p>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? filteredNotifications.map((notification) => {
          const NotificationIcon = notification.icon;
          return (
            <button
              key={notification.id}
              type="button"
              onClick={() => navigate(notification.path)}
              className="flex w-full items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <NotificationIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{notification.message}</span>
                <span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{notification.category}</span>
              </span>
            </button>
          );
        }) : (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No encontramos notificaciones</p>
            <p className="mt-1 text-sm text-muted-foreground">Prueba con otro texto o cambia el filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}
