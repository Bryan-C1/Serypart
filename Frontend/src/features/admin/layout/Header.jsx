import { Bell, Moon, Sun, LogOut, User, X, Lock, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER_STORAGE_KEY, getCurrentUser, getUserInitials } from "../../../shared/utils/currentUser";
import { apiRequest, AUTH_TOKEN_STORAGE_KEY } from "../../../shared/services/api";
import { notifications } from "../notifications/data/notifications";
import { GlobalSearch } from "../global-search/components/GlobalSearch";
import { useTheme } from "../../../hooks/useTheme";

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePreviewOpen, setProfilePreviewOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [profileForm, setProfileForm] = useState(() => {
    const user = getCurrentUser();
    return {
      name: user?.name || "No registrado",
      email: user?.email || "No registrado",
      phone: user?.phone || "No registrado",
    };
  });
  const [editableFields, setEditableFields] = useState({});
  const [passwordDialogField, setPasswordDialogField] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const openProfile = () => {
    setProfileForm({
      name: currentUser?.name || "No registrado",
      email: currentUser?.email || "No registrado",
      phone: currentUser?.phone || "No registrado",
    });
    setEditableFields({});
    setPasswordDialogField(null);
    setPasswordConfirmation("");
    setPasswordError("");
    setProfileSaved(false);
    setProfileOpen(false);
    setProfilePreviewOpen(true);
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const requestFieldEdit = (field) => {
    setPasswordDialogField(field);
    setPasswordConfirmation("");
    setPasswordError("");
  };

  const confirmFieldEdit = async (event) => {
    event.preventDefault();
    if (!passwordConfirmation) {
      setPasswordError("Ingresa tu contraseña actual.");
      return;
    }

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: { email: currentUser.email, contraseña: passwordConfirmation },
        authenticated: false,
      });
    } catch (error) {
      setPasswordError(error.message === "Credenciales inválidas" ? "La contraseña actual no es válida." : error.message);
      return;
    }

    setEditableFields((current) => ({ ...current, [passwordDialogField]: true }));
    setPasswordDialogField(null);
    setPasswordConfirmation("");
    setPasswordError("");
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const updatedUser = { ...currentUser, ...profileForm };
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setEditableFields({});
    setProfileSaved(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-2 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
      <GlobalSearch />
      <div className="flex shrink-0 items-center gap-1 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setNotificationsOpen((current) => !current)}
            className="relative p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Ver notificaciones"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-semibold">Notificaciones</h2>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {notifications.length} nuevas
                </span>
              </div>
              <div className="divide-y divide-border">
                {notifications.map((notification) => {
                  const NotificationIcon = notification.icon;
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate(notification.path);
                      }}
                      className="flex w-full gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <NotificationIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{notification.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{notification.message}</span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">{notification.time}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate("/notificaciones");
                }}
                className="w-full border-t border-border px-4 py-3 text-sm font-medium text-primary hover:bg-accent"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-2 sm:gap-3 sm:pl-4">
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Abrir perfil"
              aria-expanded={profileOpen}
            >
              <span className="text-sm font-medium text-primary-foreground">{getUserInitials(currentUser)}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="font-semibold">{getUserInitials(currentUser)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{currentUser?.name || "Usuario actual"}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser?.email || "admin@serypart.com"}</p>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={openProfile}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Mi perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/recuperar-password", {
                        state: { email: currentUser?.email || "admin@serypart.com" },
                      });
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Restablecer contraseña
                  </button>
                </div>
                <div className="border-t border-border p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
      {profilePreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-preview-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 id="profile-preview-title" className="text-xl font-semibold">Vista previa del perfil</h2>
                <p className="mt-1 text-sm text-muted-foreground">Información utilizada para crear la cuenta</p>
              </div>
              <button
                type="button"
                onClick={() => setProfilePreviewOpen(false)}
                className="rounded-lg p-2 hover:bg-accent"
                aria-label="Cerrar vista previa del perfil"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-6 p-6">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Información Personal</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm font-medium">
                    <span className="flex items-center justify-between gap-2">
                      Nombre completo
                      <button type="button" onClick={() => requestFieldEdit("name")} className="text-xs font-medium text-primary hover:underline">Editar</button>
                    </span>
                    <input name="name" value={profileForm.name} onChange={handleProfileChange} readOnly={!editableFields.name} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-normal read-only:cursor-default read-only:opacity-75" required />
                  </label>
                  <label className="space-y-1 text-sm font-medium">
                    <span className="flex items-center justify-between gap-2">
                      Teléfono
                      <button type="button" onClick={() => requestFieldEdit("phone")} className="text-xs font-medium text-primary hover:underline">Editar</button>
                    </span>
                    <input name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} readOnly={!editableFields.phone} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-normal read-only:cursor-default read-only:opacity-75" required />
                  </label>
                  <label className="space-y-1 text-sm font-medium md:col-span-2">
                    <span className="flex items-center justify-between gap-2">
                      Correo electrónico
                      <button type="button" onClick={() => requestFieldEdit("email")} className="text-xs font-medium text-primary hover:underline">Editar</button>
                    </span>
                    <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} readOnly={!editableFields.email} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-normal read-only:cursor-default read-only:opacity-75" required />
                  </label>
                </div>
              </section>
              {profileSaved && <p className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success"><CheckCircle className="h-5 w-5 shrink-0" />Perfil actualizado correctamente.</p>}
              <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setProfilePreviewOpen(false)}
                className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-accent"
              >
                Cerrar
              </button>
                <button type="submit" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">Guardar cambios</button>
              </div>
            </form>
            {passwordDialogField && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" role="presentation">
                <form onSubmit={confirmFieldEdit} className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="profile-password-title">
                  <div className="mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <h3 id="profile-password-title" className="font-semibold">Confirmar edición</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">Ingresa tu contraseña para editar este campo.</p>
                  <input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="Contraseña actual" autoFocus required />
                  {passwordError && <p className="mt-2 text-sm text-destructive">{passwordError}</p>}
                  <div className="mt-5 flex justify-end gap-3">
                    <button type="button" onClick={() => setPasswordDialogField(null)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
                    <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary">Confirmar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}