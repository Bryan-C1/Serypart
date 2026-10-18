import { Calendar } from "lucide-react";
import { repuestos } from "../services/gananciasData";

export function GananciasDetailTable({ gananciasPorProducto }) {
  const filas = [...gananciasPorProducto].sort((a, b) => b.gananciaPotencial - a.gananciaPotencial);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Detalle de Ganancias por Producto</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3 font-medium">Producto</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Ganancia/Unidad</th>
              <th className="pb-3 font-medium">Ganancia Potencial</th>
              <th className="pb-3 font-medium">Margen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filas.map((producto, index) => (
              <tr key={index} className="hover:bg-accent/50 transition-colors">
                <td className="py-4">
                  <p className="font-medium" title={producto.nombreCompleto}>{producto.nombre}</p>
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm">
                    {repuestos.find((r) => r.nombre === producto.nombreCompleto)?.stock} unidades
                  </span>
                </td>
                <td className="py-4 font-semibold text-success">
                  ${producto.gananciaPorUnidad.toFixed(2)}
                </td>
                <td className="py-4 font-semibold text-primary">
                  ${producto.gananciaPotencial.toFixed(2)}
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                    {producto.margen.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
