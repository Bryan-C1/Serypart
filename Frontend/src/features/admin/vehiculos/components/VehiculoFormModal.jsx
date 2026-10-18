import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { onlyDigits, onlyPlate, reportInvalidField } from "../../../../shared/utils/inputValidation";
import {
  ensureDatabaseMake,
  ensureDatabaseModel,
  getVehicleMakes,
  getVehicleModels,
} from "../services/vehicleCatalogService";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

const commonColors = [
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Negro", hex: "#171717" },
  { name: "Gris", hex: "#737373" },
  { name: "Plata", hex: "#C0C0C0" },
  { name: "Rojo", hex: "#DC2626" },
  { name: "Azul", hex: "#2563EB" },
  { name: "Verde", hex: "#16A34A" },
  { name: "Amarillo", hex: "#EAB308" },
  { name: "Naranja", hex: "#EA580C" },
  { name: "Marrón", hex: "#78350F" },
  { name: "Beige", hex: "#D6C6A5" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Vino tinto", hex: "#722F37" },
  { name: "Azul marino", hex: "#001F3F" },
];
const legacyColorHex = Object.fromEntries(commonColors.map(({ name, hex }) => [name, hex]));

function rgbToHex([red, green, blue]) {
  return `#${[red, green, blue].map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function rgbToHsv([red, green, blue]) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  return {
    hue: (hue + 360) % 360,
    saturation: max === 0 ? 0 : delta / max,
    value: max,
  };
}

function hsvToRgb(hue, saturation, value) {
  const chroma = value * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const offset = value - chroma;
  const channels = section < 1 ? [chroma, secondary, 0]
    : section < 2 ? [secondary, chroma, 0]
      : section < 3 ? [0, chroma, secondary]
        : section < 4 ? [0, secondary, chroma]
          : section < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  return channels.map((channel) => Math.round((channel + offset) * 255));
}

function closestColorName(hex) {
  const channels = hex.match(/[A-Fa-f0-9]{2}/g)?.map((channel) => parseInt(channel, 16));
  if (!channels || channels.length !== 3) return "Color personalizado";
  return commonColors.reduce((closest, color) => {
    const candidate = color.hex.match(/[A-Fa-f0-9]{2}/g).map((channel) => parseInt(channel, 16));
    const distance = channels.reduce((total, value, index) => total + (value - candidate[index]) ** 2, 0);
    return distance < closest.distance ? { name: color.name, distance } : closest;
  }, { name: "Color personalizado", distance: Infinity }).name;
}

export function VehiculoFormModal({
  modal,
  form,
  setForm,
  onClose,
  onGuardar,
  usuarios = [],
  usuariosLoading = false,
  usuariosError = "",
  onRetryUsuarios,
  tiposVehiculo = [],
  tiposVehiculoLoading = false,
  tiposVehiculoError = "",
  onRetryTipos,
  saveError = "",
}) {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [selectionSaving, setSelectionSaving] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [catalogRetry, setCatalogRetry] = useState(0);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [draftColor, setDraftColor] = useState("#FFFFFF");
  const [draftRgb, setDraftRgb] = useState(["255", "255", "255"]);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const colorWidgetRef = useRef(null);
  const saturationFieldRef = useRef(null);

  useEffect(() => {
    if (modal !== "crear" && modal !== "editar") return undefined;
    let active = true;
    const loadCatalog = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      setSelectedMakeId("");
      setSelectedModelId("");
      setModelos([]);
      try {
        const makeRows = await getVehicleMakes();
        if (!active) return;
        setMarcas(makeRows);
        const selectedMake = makeRows.find((make) => Number(make.Database_ID) === Number(form.id_marca));
        if (selectedMake) {
          setSelectedMakeId(String(selectedMake.Make_ID));
          setModelLoading(true);
          const modelRows = await getVehicleModels(selectedMake);
          if (!active) return;
          setModelos(modelRows);
          const selectedModel = modelRows.find((model) => Number(model.Database_ID) === Number(form.id_modelo));
          if (selectedModel) setSelectedModelId(String(selectedModel.Model_ID));
        }
      } catch (error) {
        if (active) setCatalogError(error.message);
      } finally {
        if (active) {
          setCatalogLoading(false);
          setModelLoading(false);
        }
      }
    };
    loadCatalog();
    return () => {
      active = false;
    };
  }, [modal, catalogRetry]);

  const handleMakeChange = async (event) => {
    const make = marcas.find((item) => String(item.Make_ID) === event.target.value);
    if (!make) return;
    setSelectedMakeId(String(make.Make_ID));
    setSelectedModelId("");
    setModelos([]);
    setCatalogError("");
    setSelectionSaving(true);
    setModelLoading(true);
    setForm((current) => ({ ...current, id_marca: "", id_modelo: "" }));
    try {
      const databaseMakeId = make.Database_ID || await ensureDatabaseMake(make);
      setForm((current) => ({ ...current, id_marca: Number(databaseMakeId) }));
      const modelRows = await getVehicleModels({ ...make, Database_ID: Number(databaseMakeId) });
      setModelos(modelRows);
    } catch (error) {
      setCatalogError(error.message);
    } finally {
      setSelectionSaving(false);
      setModelLoading(false);
    }
  };

  const handleModelChange = async (event) => {
    const model = modelos.find((item) => String(item.Model_ID) === event.target.value);
    if (!model || !form.id_marca) return;
    setSelectedModelId(String(model.Model_ID));
    setCatalogError("");
    setSelectionSaving(true);
    setForm((current) => ({ ...current, id_modelo: "" }));
    try {
      const databaseModelId = model.Database_ID || await ensureDatabaseModel(model, form.id_marca);
      setForm((current) => ({ ...current, id_modelo: Number(databaseModelId) }));
    } catch (error) {
      setSelectedModelId("");
      setCatalogError(error.message);
    } finally {
      setSelectionSaving(false);
    }
  };

  useEffect(() => {
    if (!colorPickerOpen) return undefined;
    const closeIfOutside = (event) => {
      if (!colorWidgetRef.current?.contains(event.target)) setColorPickerOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setColorPickerOpen(false);
    };
    document.addEventListener("pointerdown", closeIfOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeIfOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [colorPickerOpen]);

  if (modal !== "crear" && modal !== "editar") return null;

  const selectedHex = form.colorHex || (/^#[\da-f]{6}$/i.test(form.color) ? form.color : legacyColorHex[form.color]) || "";
  const updateDraftFromHsv = (nextHue, nextSaturation, nextBrightness) => {
    const rgb = hsvToRgb(nextHue, nextSaturation, nextBrightness);
    setHue(nextHue);
    setSaturation(nextSaturation);
    setBrightness(nextBrightness);
    setDraftRgb(rgb.map(String));
    setDraftColor(rgbToHex(rgb));
  };

  const updateDraftFromHex = (value) => {
    setDraftColor(value.toUpperCase());
    if (!/^#[\da-f]{6}$/i.test(value)) return;
    const rgb = hexToRgb(value);
    const hsv = rgbToHsv(rgb);
    setDraftRgb(rgb.map(String));
    setHue(hsv.hue);
    setSaturation(hsv.saturation);
    setBrightness(hsv.value);
  };

  const openColorPicker = () => {
    const startingHex = /^#[\da-f]{6}$/i.test(selectedHex) ? selectedHex : "#FFFFFF";
    const rgb = hexToRgb(startingHex);
    const hsv = rgbToHsv(rgb);
    setDraftColor(startingHex.toUpperCase());
    setDraftRgb(rgb.map(String));
    setHue(hsv.hue);
    setSaturation(hsv.saturation);
    setBrightness(hsv.value);
    setColorPickerOpen(true);
  };

  const updateSaturationBrightness = (event) => {
    if (event.buttons !== 1 && event.type !== "pointerdown") return;
    const bounds = saturationFieldRef.current.getBoundingClientRect();
    const nextSaturation = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const nextBrightness = 1 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    updateDraftFromHsv(hue, nextSaturation, nextBrightness);
  };

  const updateRgbChannel = (channelIndex, value) => {
    const nextRgb = [...draftRgb];
    nextRgb[channelIndex] = value;
    setDraftRgb(nextRgb);
    if (!nextRgb.every((channel) => /^\d{1,3}$/.test(channel) && Number(channel) <= 255)) return;
    const rgb = nextRgb.map(Number);
    const hsv = rgbToHsv(rgb);
    setDraftColor(rgbToHex(rgb));
    setHue(hsv.hue);
    setSaturation(hsv.saturation);
    setBrightness(hsv.value);
  };

  const acceptColor = () => {
    setForm((current) => ({
      ...current,
      colorHex: draftColor.toUpperCase(),
      color: closestColorName(draftColor),
    }));
    setColorPickerOpen(false);
  };

  const handlePlacaChange = (event) => {
    const placa = onlyPlate(event.target.value).slice(0, 7);
    event.target.setCustomValidity(
      !placa
        ? "La placa es obligatoria."
        : /^[A-Z]{3}-[0-9]{3}$/.test(placa)
          ? ""
          : "La placa debe tener 3 letras, un guion y 3 números (ejemplo: ABC-123)."
    );
    setForm((current) => ({ ...current, placa }));
  };

  const handleInvalidField = (event) => {
    const field = event.target;
    if (field.validity.valueMissing) {
      field.setCustomValidity("Este campo es obligatorio.");
    } else if (field.validity.patternMismatch) {
      field.setCustomValidity("La placa debe tener 3 letras, un guion y 3 números (ejemplo: ABC-123).");
    }
  };

  const clearInvalidMessage = (event) => event.target.setCustomValidity("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onInvalid={handleInvalidField} onInput={clearInvalidMessage}>
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">{modal === "crear" ? "Nuevo Vehículo" : "Editar Vehículo"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de vehículo *</label>
              <SearchableSelect
                value={form.id_tipo_vehiculo}
                onChange={(e) => setForm((f) => ({ ...f, id_tipo_vehiculo: Number(e.target.value) }))}
                required
                disabled={tiposVehiculoLoading || Boolean(tiposVehiculoError)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {tiposVehiculo.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
              </SearchableSelect>
              {tiposVehiculoLoading && <p role="status" className="mt-1 text-xs text-muted-foreground">Cargando tipos de vehículo...</p>}
              {tiposVehiculoError && (
                <div role="alert" className="mt-2 flex items-center justify-between gap-2 text-xs text-destructive">
                  <span>{tiposVehiculoError}</span>
                  <button type="button" onClick={onRetryTipos} className="font-medium underline">Reintentar</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Placa *</label>
              <input
                type="text"
                placeholder="ABC-123"
                value={form.placa}
                onChange={handlePlacaChange}
                maxLength={7}
                pattern="[A-Z]{3}-[0-9]{3}"
                title="La placa debe tener 3 letras, un guion y 3 números (ejemplo: ABC-123)"
                onInvalid={(e) => e.currentTarget.setCustomValidity(
                  !e.currentTarget.value
                    ? "La placa es obligatoria."
                    : "La placa debe tener 3 letras, un guion y 3 números (ejemplo: ABC-123)."
                )}
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg placeholder:opacity-60 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cliente *</label>
              <SearchableSelect
                value={form.id_cliente}
                onChange={(e) => setForm((f) => ({ ...f, id_cliente: Number(e.target.value) }))}
                required
                disabled={usuariosLoading || Boolean(usuariosError)}
                placeholder="Seleccionar cliente..."
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {usuarios.map((usuario) => <option key={usuario.id_cliente ?? usuario.id} value={usuario.id_cliente ?? usuario.id}>{usuario.nombre}</option>)}
              </SearchableSelect>
              {usuariosLoading && <p role="status" className="mt-1 text-xs text-muted-foreground">Cargando clientes...</p>}
              {usuariosError && (
                <div role="alert" className="mt-2 flex items-center justify-between gap-2 text-xs text-destructive">
                  <span>{usuariosError}</span>
                  <button type="button" onClick={onRetryUsuarios} className="font-medium underline">Reintentar</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Marca *</label>
              <SearchableSelect
                value={selectedMakeId}
                onChange={handleMakeChange}
                required
                disabled={catalogLoading || selectionSaving || Boolean(catalogError)}
                placeholder="Seleccionar marca..."
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {marcas.map((marca) => <option key={marca.Make_ID} value={marca.Make_ID}>{marca.Make_Name}</option>)}
              </SearchableSelect>
              {catalogLoading && <p role="status" className="mt-1 text-xs text-muted-foreground">Cargando marcas...</p>}
              {catalogError && (
                <div role="alert" className="mt-2 flex items-center justify-between gap-2 text-xs text-destructive">
                  <span>{catalogError}</span>
                  <button type="button" onClick={() => setCatalogRetry((attempt) => attempt + 1)} className="font-medium underline">Reintentar</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modelo *</label>
              <SearchableSelect
                value={selectedModelId}
                onChange={handleModelChange}
                required={Boolean(form.id_marca)}
                disabled={!form.id_marca || modelLoading || selectionSaving || Boolean(catalogError)}
                placeholder={!form.id_marca ? "Selecciona primero una marca" : modelLoading ? "Cargando modelos..." : "Seleccionar modelo..."}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {modelos.map((modelo) => (
                  <option key={modelo.Model_ID} value={modelo.Model_ID}>{modelo.Model_Name}</option>
                ))}
              </SearchableSelect>
              {modelLoading && <p role="status" className="mt-1 text-xs text-muted-foreground">Cargando modelos...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div ref={colorWidgetRef} className="relative">
                <button
                  type="button"
                  onClick={() => colorPickerOpen ? setColorPickerOpen(false) : openColorPicker()}
                  aria-haspopup="dialog"
                  aria-expanded={colorPickerOpen}
                  className="flex w-full items-center gap-3 rounded-lg border border-border bg-input-background px-3 py-2 text-left hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: selectedHex || "transparent" }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-sm">{selectedHex || "Seleccionar color"}</span>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </button>
                {colorPickerOpen && (
                  <div
                    role="dialog"
                    aria-label="Selector de color personalizado"
                    className="absolute left-0 top-full z-[80] mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl"
                  >
                    <div
                      ref={saturationFieldRef}
                      role="group"
                      aria-label="Saturación y brillo"
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        updateSaturationBrightness(event);
                      }}
                      onPointerMove={updateSaturationBrightness}
                      onKeyDown={(event) => {
                        const step = event.shiftKey ? 0.1 : 0.02;
                        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
                        event.preventDefault();
                        const nextSaturation = Math.max(0, Math.min(1, saturation + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0)));
                        const nextBrightness = Math.max(0, Math.min(1, brightness + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0)));
                        updateDraftFromHsv(hue, nextSaturation, nextBrightness);
                      }}
                      tabIndex={0}
                      className="relative h-36 w-full touch-none cursor-crosshair overflow-hidden rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ backgroundColor: `hsl(${hue} 100% 50%)` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                      <span
                        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.55)]"
                        style={{ left: `${saturation * 100}%`, top: `${(1 - brightness) * 100}%` }}
                      />
                    </div>
                    <input
                      aria-label="Tono"
                      type="range"
                      min="0"
                      max="359"
                      value={Math.round(hue)}
                      onChange={(event) => updateDraftFromHsv(Number(event.target.value), saturation, brightness)}
                      className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full border border-border"
                      style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
                    />
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      <label className="col-span-2 text-xs text-muted-foreground">
                        HEX
                        <input
                          value={draftColor}
                          onChange={(event) => updateDraftFromHex(event.target.value)}
                          onBlur={() => {
                            if (!/^#[\da-f]{6}$/i.test(draftColor)) updateDraftFromHex(selectedHex || "#FFFFFF");
                          }}
                          aria-label="Valor HEX"
                          className="mt-1 w-full rounded-md border border-border bg-input-background px-2 py-1.5 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      {["R", "G", "B"].map((channel, index) => (
                        <label key={channel} className="text-xs text-muted-foreground">
                          {channel}
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={draftRgb[index]}
                            onChange={(event) => updateRgbChannel(index, event.target.value)}
                            aria-label={channel === "R" ? "Rojo" : channel === "G" ? "Verde" : "Azul"}
                            className="mt-1 w-full rounded-md border border-border bg-input-background px-2 py-1.5 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3" aria-label="Colores comunes de carros">
                      {commonColors.map(({ name, hex }) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => updateDraftFromHex(hex)}
                          aria-label={`${name} ${hex}`}
                          title={name}
                          className={`h-6 w-6 rounded-full border border-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${draftColor === hex ? "ring-2 ring-primary ring-offset-1 ring-offset-popover" : ""}`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setColorPickerOpen(false)}
                        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={acceptColor}
                        className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Año</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.año}
                onChange={(e) => setForm((f) => ({ ...f, año: onlyDigits(e.target.value).slice(0, 4) }))}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <SearchableSelect
                value={form.estado}
                onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                searchable={false}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="activo">Activo</option>
                <option value="en_servicio">En Servicio</option>
                <option value="inactivo">Inactivo</option>
              </SearchableSelect>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          {saveError && <p role="alert" className="mr-auto self-center text-sm text-destructive">{saveError}</p>}
          <button onClick={onClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => reportInvalidField() && onGuardar()}
            disabled={catalogLoading || modelLoading || selectionSaving || Boolean(catalogError) || tiposVehiculoLoading || Boolean(tiposVehiculoError)
              || usuariosLoading || Boolean(usuariosError) || !form.placa || !form.id_cliente || !form.id_marca
              || !form.id_modelo || !form.id_tipo_vehiculo}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {modal === "crear" ? "Guardar Vehículo" : "Actualizar Vehículo"}
          </button>
        </div>
      </div>
    </div>
  );
}
