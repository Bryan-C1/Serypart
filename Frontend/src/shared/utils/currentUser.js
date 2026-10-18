export const CURRENT_USER_STORAGE_KEY = "serypart.currentUser";

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function getUserInitials(user) {
  const value = user?.name || user?.email || "";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return value.slice(0, 2).toUpperCase() || "US";
}
