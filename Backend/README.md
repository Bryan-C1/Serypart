# SeryPart API (Node.js + Express + MySQL)

API REST para el proyecto SeryPart, consumida por la app Flutter con Clean
Architecture (domain / data / presentation).

Estructura **explícita**: cada tabla tiene su propio archivo
de modelo, controlador y rutas — sin abstracciones genéricas, para que sea
fácil de leer y de explicar tabla por tabla.

## 1. Instalación

```bash
cd serypart-api
npm install
cp .env.example .env
```

Edita `.env` con tus datos de conexión (usa `serypart.sql` para crear la
base de datos e importar las tablas). Configura también `JWT_SECRET` con una
clave aleatoria larga; esta variable es necesaria para iniciar sesión y validar
los tokens. No compartas ni agregues tu archivo `.env` al repositorio.

Después, ejecuta las migraciones pendientes en orden. Para habilitar
la gestión de mecánicos, aplica `migrations/001_roles_permisos.sql`; esta
migración agrega `roles.estado`, usado para seleccionar el rol activo al crear
un mecánico. Para habilitar asignaciones de mecánicos en citas, aplica
`migrations/006_asignar_mecanicos_agendamiento.sql` y
`migrations/007_registrar_historial_servicios.sql`. La migración 007 llena
el historial con citas completadas y ventas pagadas que ocurrieron después
de una cita completada. La tabla `mecanicos` existente conserva su relación
con `usuarios`. Para registrar asistencias de mecánicos,
aplica `migrations/009_mecanicos_asistencia_trabajos.sql` en la base de datos
antes de iniciar el servidor. Cada asistencia guarda fecha y horas de entrada
y salida dentro del horario del taller (lunes a viernes, 08:00 a 17:00;
sábados, 08:00 a 14:00). Después aplica
`migrations/010_ventas_mecanico_servicios.sql` para asociar ventas con citas y
guardar repuestos y servicios en `detalle_venta`; la migración amplía esa tabla
y no crea una tabla adicional. El calendario mensual permite registrar asistencia y
consultar los trabajos de cada día desde las ventas no canceladas asociadas a
citas del mecánico. La liquidación mensual suma los subtotales de esos servicios
únicamente en los días con asistencia; no incluye repuestos.
Aplica también `migrations/012_servicios_jerarquia.sql` para habilitar códigos
jerárquicos de servicios de hasta tres niveles.
Si `agendamiento.id_mecanico` tiene una clave foránea heredada hacia
`usuarios.id_usuario`, aplica `migrations/011_agendamiento_mecanicos_fk.sql`
para enlazar las citas con `mecanicos.id_mecanico` y conservar las asignaciones
de mecánicos existentes.

## 2. Ejecutar

```bash
npm run dev     # con nodemon
# o
npm start
```

Queda en `http://localhost:3000`.

## 3. Estructura

```
src/
  config/db.js              -> pool de conexión MySQL
  models/<tabla>.model.js    -> queries SQL de esa tabla (getAll, getById, create, update, remove)
  controllers/<tabla>.controller.js -> recibe req/res y llama al modelo
  routes/<tabla>.routes.js   -> define los 5 endpoints de esa tabla
  routes/index.js            -> monta las rutas + /auth
  middlewares/
    auth.middleware.js       -> valida el JWT
    error.middleware.js      -> maneja errores
  controllers/auth.controller.js  -> register / login
app.js
server.js
```

Ejemplo (`vehiculos`): `models/vehiculos.model.js` tiene las queries,
`controllers/vehiculos.controller.js` las usa, `routes/vehiculos.routes.js`
las expone en `/api/vehiculos`. Así para cada una de las 22 tablas.

## 4. Endpoints

Autenticación:
- `POST /api/auth/register` — `nombre, apellido, email, contraseña, telefono, numero_documento, tipo_documento, id_rol`
- `POST /api/auth/login` — `email, contraseña` → `{ token, usuario }`

Cada tabla expone:

| Método | Ruta                     |
|--------|--------------------------|
| GET    | /api/&lt;tabla&gt;       |
| GET    | /api/&lt;tabla&gt;/:id   |
| POST   | /api/&lt;tabla&gt;       |
| PUT    | /api/&lt;tabla&gt;/:id  |
| DELETE | /api/&lt;tabla&gt;/:id  |

POST/PUT/DELETE siempre piden token (`Authorization: Bearer <token>`).
En `usuarios`, `roles`, `compras`, `ventas`, `proveedores`,
`detalle-compra` y `detalle-venta` el GET también pide token, por ser datos
sensibles o administrativos. Los nombres exactos de ruta de cada tabla están
en `src/routes/index.js`.

El módulo de mecánicos está disponible en `/api/mecanicos` (GET, GET por ID,
POST, PUT y DELETE); todas sus rutas requieren autenticación.

`usuarios` nunca devuelve el campo `contraseña` en las respuestas.

## 5. Conexión con Flutter (Clean Architecture)

Igual que el ejemplo del documento del curso (repository con `baseUrl` +
`fromJson`/`toJson`), solo cambia la URL y los campos del modelo:

```dart
// data/repositories/vehiculo_repository_impl.dart
class VehiculoRepositoryImpl implements VehiculoRepository {
  final String baseUrl = "http://TU_IP:3000/api/vehiculos";

  @override
  Future<List<VehiculoEntity>> getVehiculos() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      List data = json.decode(response.body);
      return data.map((json) => VehiculoModel.fromJson(json)).toList();
    }
    throw Exception("Error al obtener vehículos");
  }
  // createVehiculo, updateVehiculo, deleteVehiculo -> mismo patrón que el ejemplo de usuarios
}
```

Para rutas protegidas, agrega el token guardado tras el login:

```dart
headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer $token",
}
```

## 6. Notas para el sustento oral

- Sin ORM: las queries van parametrizadas (`?`), directas y fáciles de leer.
- Un archivo por tabla en `models/`, `controllers/` y `routes/`: cada uno se
  puede abrir y explicar por separado, sin buscar lógica compartida.
- JWT: el login firma un token con los datos del usuario (id, rol);
  `auth.middleware.js` lo valida antes de dejar pasar la petición.
