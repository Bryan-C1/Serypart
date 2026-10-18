import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGanancias } from "../hooks/useGanancias";
import { PeriodToggle } from "../components/PeriodToggle";
import { StatsRow } from "../components/StatsRow";
import { GananciaPorProductoBarChart } from "../components/GananciaPorProductoBarChart";
import { GananciaPorCategoriaPieChart } from "../components/GananciaPorCategoriaPieChart";
import { VentasTrendLineChart } from "../components/VentasTrendLineChart";
import { MargenBarChart } from "../components/MargenBarChart";
import { GananciasDetailTable } from "../components/GananciasDetailTable";
import { SummaryBanner } from "../components/SummaryBanner";

export default function GananciasPage() {
  const navigate = useNavigate();
  const {
    periodoSeleccionado, setPeriodoSeleccionado, datosGrafica,
    gananciasPorProducto, gananciasPorCategoria, ventasDelPeriodo, totales,
  } = useGanancias();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/repuestos")}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Volver a Repuestos"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold">Análisis de Ganancias</h1>
            <p className="text-muted-foreground mt-1">Visualiza las ganancias y márgenes de tus repuestos</p>
          </div>
        </div>

        <PeriodToggle periodoSeleccionado={periodoSeleccionado} onChange={setPeriodoSeleccionado} />
      </div>

      <StatsRow totales={totales} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GananciaPorProductoBarChart gananciasPorProducto={gananciasPorProducto} />
        <GananciaPorCategoriaPieChart gananciasPorCategoria={gananciasPorCategoria} />
        <VentasTrendLineChart datosGrafica={datosGrafica} periodoSeleccionado={periodoSeleccionado} />
        <MargenBarChart gananciasPorProducto={gananciasPorProducto} />
      </div>

      <GananciasDetailTable gananciasPorProducto={gananciasPorProducto} />

      <SummaryBanner periodoSeleccionado={periodoSeleccionado} totales={totales} ventasDelPeriodo={ventasDelPeriodo} />
    </div>
  );
}
