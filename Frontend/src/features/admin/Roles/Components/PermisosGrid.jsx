import { MODULOS, ACCIONES } from "../Services/rolesData";

export function PermisosGrid({ permisos, onChange }) {
  function toggle(moduloKey, accionKey) {
    onChange({
      ...permisos,
      [moduloKey]: {
        ...permisos[moduloKey],
        [accionKey]: !permisos[moduloKey]?.[accionKey],
      },
    });
  }

  function toggleFila(moduloKey) {
    const todosActivos = ACCIONES.every((a) => permisos[moduloKey]?.[a.key]);
    const nuevo = {};
    ACCIONES.forEach((a) => { nuevo[a.key] = !todosActivos; });
    onChange({ ...permisos, [moduloKey]: nuevo });
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/50 sticky top-0">
            <tr className="text-left">
              <th className="px-4 py-2 font-medium">Módulo</th>
              {ACCIONES.map((a) => (
                <th key={a.key} className="px-3 py-2 font-medium text-center">{a.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MODULOS.map((m) => (
              <tr key={m.key} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => toggleFila(m.key)}
                    className="font-medium hover:text-primary transition-colors text-left"
                    title="Marcar/desmarcar toda la fila"
                  >
                    {m.label}
                  </button>
                </td>
                {ACCIONES.map((a) => (
                  <td key={a.key} className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!permisos[m.key]?.[a.key]}
                      onChange={() => toggle(m.key, a.key)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
