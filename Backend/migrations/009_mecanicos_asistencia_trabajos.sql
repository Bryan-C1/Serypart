ALTER TABLE mecanicos
  ADD UNIQUE KEY uq_mecanicos_id_mecanico (id_mecanico);

CREATE TABLE IF NOT EXISTS asistencias_mecanicos (
  id_asistencia INT NOT NULL AUTO_INCREMENT,
  id_mecanico INT NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  PRIMARY KEY (id_asistencia),
  UNIQUE KEY uq_asistencia_mecanico_fecha (id_mecanico, fecha),
  KEY idx_asistencia_fecha (fecha),
  CONSTRAINT fk_asistencia_mecanico
    FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico)
    ON DELETE RESTRICT,
  CONSTRAINT chk_asistencia_horas
    CHECK (hora_fin > hora_inicio)
);

CREATE TABLE IF NOT EXISTS trabajos_mecanicos (
  id_trabajo INT NOT NULL AUTO_INCREMENT,
  id_mecanico INT NOT NULL,
  id_servicio INT NULL,
  nombre_servicio VARCHAR(150) NOT NULL,
  fecha DATE NOT NULL,
  precio_servicio DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (id_trabajo),
  KEY idx_trabajo_mecanico_fecha (id_mecanico, fecha),
  CONSTRAINT fk_trabajo_mecanico
    FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico)
    ON DELETE RESTRICT,
  CONSTRAINT fk_trabajo_servicio
    FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON DELETE SET NULL,
  CONSTRAINT chk_trabajo_precio
    CHECK (precio_servicio >= 0)
);
