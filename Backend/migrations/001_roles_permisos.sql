ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS permisos JSON NULL,
  ADD COLUMN IF NOT EXISTS estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo';
