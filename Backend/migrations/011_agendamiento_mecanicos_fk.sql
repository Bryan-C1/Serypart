INSERT INTO mecanicos (id_mecanico, id_usuario, especialidad, turno)
SELECT u.id_usuario, u.id_usuario, 'General', 'Completo'
  FROM usuarios u
  JOIN roles r ON r.id_rol = u.id_rol
  JOIN agendamiento a ON a.id_mecanico = u.id_usuario
  LEFT JOIN mecanicos m ON m.id_usuario = u.id_usuario OR m.id_mecanico = u.id_usuario
 WHERE LOWER(TRIM(r.nombre)) IN ('mecanico', 'mecanicos')
   AND LOWER(TRIM(u.estado)) = 'activo'
   AND m.id_mecanico IS NULL
 GROUP BY u.id_usuario;

ALTER TABLE agendamiento
  DROP FOREIGN KEY fk_agendamiento_mecanico;

ALTER TABLE agendamiento
  ADD CONSTRAINT fk_agendamiento_mecanico
    FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico);
