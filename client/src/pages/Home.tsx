import { useState, useMemo } from "react";
import { events as initialEvents, territorios, Event } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Pencil, Trash2, Plus } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Eventos extra de Risaralda (imagen Excel) — se fusionan con
// los de events.ts en tiempo de ejecución
// ─────────────────────────────────────────────────────────────
const RISARALDA_EXTRA: Event[] = [
  {
    id: "pereira-001",
    nombre: "Fiestas de la Cosecha",
    municipio: "Pereira",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "15-31 de agosto",
    descripcion:
      "Celebración aniversaria de Pereira con más de 130 eventos: Carnaval de la Cosecha (Patrimonio Cultural de la Ciudad), conciertos nacionales e internacionales, feria artesanal, gastronomía, desfiles y actividades deportivas. Uno de los eventos más importantes del Eje Cafetero.",
    secretaria: "Secretaría de Desarrollo Económico y Competitividad",
    telefono: "3128262290",
    correo: "comunicaciones@pereira.gov.co",
    sitioweb: "https://www.pereira.gov.co",
    mes: 8,
    contacto: "Kelly Jhoana García Urueta",
  },
  {
    id: "santarosa-001",
    nombre: "Fiestas Aniversarias de las Araucarias",
    municipio: "Santa Rosa de Cabal",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "5-14 de octubre",
    descripcion:
      "Celebración aniversaria de Santa Rosa de Cabal con el Festival del Chorizo, Desfile del Yipao, Cabal Fest con artistas nacionales e internacionales, concierto góspel y megaconcierto de clausura. Homenaje al legado de los 'hueveros'.",
    secretaria: "Alcaldía Municipal de Santa Rosa de Cabal",
    telefono: "3218803071",
    correo: "alcaldia@santarosadecabal-risaralda.gov.co",
    sitioweb: "https://www.santarosadecabal-risaralda.gov.co",
    mes: 10,
    contacto: "Juan Pablo Toro",
  },
  {
    id: "apia-001",
    nombre: "La Calle del Café",
    municipio: "Apía",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Noviembre",
    descripcion:
      "Festival cafetero que reúne a caficultores, baristas y autoridades. Incluye desfiles con familias caficultoras, más de 40 marcas de cafés especiales, concursos de catación y Aeropress, feria gastronómica y rueda de negocios.",
    secretaria: "Alcaldía Municipal de Apía",
    telefono: "3159269523",
    correo: "danielerendonv@gmail.com",
    sitioweb: "https://www.apia-risaralda.gov.co",
    mes: 11,
    contacto: "Daniel Rendón",
  },
  {
    id: "belenumbria-001",
    nombre: "Fiestas de la Caficultura",
    municipio: "Belén de Umbría",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Agosto",
    descripcion:
      "Celebración aniversaria del municipio conocido como primer productor de café de Risaralda. Incluye la Marcha del Arraigo Belumbrense, Festival de Danza Folclórica 'Zarandiando', Noche de Gala y muestras artísticas de tradición cafetera.",
    secretaria: "Dirección Municipal de Cultura y Deporte",
    telefono: "3117486503",
    correo: "didiego23@hotmail.com",
    sitioweb: "https://www.belendeumbria-risaralda.gov.co",
    mes: 8,
    contacto: "Diego Gómez",
  },
  {
    id: "lavirginia-001",
    nombre: "Fiestas del Río Cauca",
    municipio: "La Virginia",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Agosto",
    descripcion:
      "Festival que celebra la identidad del 'Puerto Dulce de Colombia' y su vínculo con el río Cauca. Incluye actividades acuáticas, gastronomía típica de pescado (Viudo de Pescado) y cultura ribereña.",
    secretaria: "Alcaldía Municipal de La Virginia",
    telefono: "3186529159",
    correo: "comunicaciones@lavirginia-risaralda.gov.co",
    sitioweb: "https://www.lavirginia-risaralda.gov.co",
    mes: 8,
    contacto: "Diego Mauricio Soto",
  },
  {
    id: "lavirginia-002",
    nombre: "Fiestas Aniversarias del Sol, Río y la Arena",
    municipio: "La Virginia",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Noviembre",
    descripcion:
      "Celebración del aniversario de La Virginia con Desfile de Canoas por el río Cauca, Reinado Señorita Virginia, Muestra Artesanal, Muestra Gastronómica, Cabalgata Aniversaria y conciertos con orquestas nacionales e internacionales.",
    secretaria: "Alcaldía Municipal de La Virginia",
    telefono: "3186529159",
    correo: "comunicaciones@lavirginia-risaralda.gov.co",
    sitioweb: "https://www.lavirginia-risaralda.gov.co",
    mes: 11,
    contacto: "Diego Mauricio Soto",
  },
  {
    id: "santuario-001",
    nombre: "Fiesta de Disfraces",
    municipio: "Santuario",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "31 de octubre",
    descripcion:
      "Fiesta tradicional de Halloween en Santuario 'La Perla de Tatamá'. Convoca a miles de personas para disfrutar de disfraces, música y celebración cultural en la plaza principal.",
    secretaria: "Dirección Municipal de Cultura y Deporte",
    telefono: "3212813601",
    correo: "jharolguerrerovalencia@gmail.com",
    sitioweb: "https://www.santuario-risaralda.gov.co",
    mes: 10,
    contacto: "Jharol Guerrero Valencia",
  },
  {
    id: "santuario-002",
    nombre: "Fiestas del Retorno",
    municipio: "Santuario",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "22-25 de noviembre",
    descripcion:
      "Celebración aniversaria con recibimiento de colonias, bandas sinfónicas, Festival Departamental de Danza Folclórica, Desfile del Yipao, actividades deportivas y conciertos. Celebra la identidad paisa y el reencuentro con las raíces del municipio.",
    secretaria: "Dirección Municipal de Cultura y Deporte",
    telefono: "3212813601",
    correo: "jharolguerrerovalencia@gmail.com",
    sitioweb: "https://www.santuario-risaralda.gov.co",
    mes: 11,
    contacto: "Jharol Guerrero Valencia",
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Normaliza texto para búsqueda: minúsculas + sin tildes
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Deduplica por id: los eventos extra sobreescriben si ya existe el mismo id
function mergeEvents(base: Event[], extra: Event[]): Event[] {
  const map = new Map<string, Event>();
  base.forEach((e) => map.set(e.id, e));
  extra.forEach((e) => map.set(e.id, e)); // sobrescribe duplicados
  return Array.from(map.values());
}

// Inferir departamento de eventos del events.ts que no lo tengan
function inferDepartamento(event: Event): string {
  if (event.departamento) return event.departamento;
  const t = event.territorio?.toLowerCase() ?? "";
  if (t.includes("chocó") || t.includes("choco")) return "Chocó";
  if (t.includes("urabá") || t.includes("uraba")) return "Antioquia";
  if (t.includes("bajo cauca"))                   return "Antioquia";
  if (t.includes("medellín") || t.includes("medellin")) return "Antioquia";
  if (t.includes("aburrá") || t.includes("abarra"))     return "Antioquia";
  if (t.includes("risaralda"))                    return "Risaralda";
  if (t.includes("quindío") || t.includes("quindio"))   return "Quindío";
  if (t.includes("caldas"))                       return "Caldas";
  return "Antioquia"; // fallback
}

const MESES: { value: string; label: string }[] = [
  { value: "1",  label: "Enero"      }, { value: "2",  label: "Febrero"    },
  { value: "3",  label: "Marzo"      }, { value: "4",  label: "Abril"      },
  { value: "5",  label: "Mayo"       }, { value: "6",  label: "Junio"      },
  { value: "7",  label: "Julio"      }, { value: "8",  label: "Agosto"     },
  { value: "9",  label: "Septiembre" }, { value: "10", label: "Octubre"    },
  { value: "11", label: "Noviembre"  }, { value: "12", label: "Diciembre"  },
];

// ─────────────────────────────────────────────────────────────
// Modal Agregar / Editar
// ─────────────────────────────────────────────────────────────

function emptyEvent(): Event {
  return {
    id: `custom-${Date.now()}`,
    nombre: "", municipio: "", territorio: "", departamento: "",
    fechas: "", descripcion: "", secretaria: "", telefono: "",
    correo: "", sitioweb: "", mes: 0, contacto: "",
  };
}

function EventModal({
  event, mode, onSave, onClose,
}: {
  event: Event; mode: "edit" | "add"; onSave: (e: Event) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Event>({ ...event });
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>({});

  const set = (key: keyof Event, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Partial<Record<keyof Event, string>> = {};
    if (!form.nombre.trim())        e.nombre       = "Requerido";
    if (!form.municipio.trim())     e.municipio    = "Requerido";
    if (!form.territorio.trim())    e.territorio   = "Requerido";
    if (!form.departamento?.trim()) e.departamento = "Requerido";
    if (!form.fechas.trim())        e.fechas       = "Requerido";
    if (!form.descripcion.trim())   e.descripcion  = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fields: { label: string; key: keyof Event; required?: boolean }[] = [
    { label: "Nombre del evento",           key: "nombre",       required: true },
    { label: "Departamento",                key: "departamento", required: true },
    { label: "Territorio / Región",         key: "territorio",   required: true },
    { label: "Municipio",                   key: "municipio",    required: true },
    { label: "Fechas",                      key: "fechas",       required: true },
    { label: "Secretaría / Entidad",        key: "secretaria" },
    { label: "Teléfono",                    key: "telefono"   },
    { label: "Correo",                      key: "correo"     },
    { label: "Sitio web",                   key: "sitioweb"   },
    { label: "Contacto (nombre)",           key: "contacto"   },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div className="bg-background rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-base font-semibold">
            {mode === "add" ? "Agregar nuevo evento" : "Editar evento"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none px-2">×</button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {fields.map(({ label, key, required }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground block mb-1">
                {label}{required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <Input value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)}
                className={errors[key] ? "border-rose-500" : ""} />
              {errors[key] && <p className="text-xs text-rose-500 mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Mes del evento</label>
            <select value={form.mes} onChange={(e) => set("mes", parseInt(e.target.value))}
              className="w-full text-sm p-2 border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option value={0}>Sin mes definido</option>
              {MESES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Descripción <span className="text-rose-500">*</span>
            </label>
            <textarea rows={4} value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              className={`w-full text-sm p-2 border rounded-md bg-background text-foreground resize-y outline-none focus:ring-1 focus:ring-primary font-sans ${errors.descripcion ? "border-rose-500" : "border-border"}`} />
            {errors.descripcion && <p className="text-xs text-rose-500 mt-1">{errors.descripcion}</p>}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1" onClick={() => { if (validate()) { onSave(form); onClose(); } }}>
            {mode === "add" ? "Agregar evento" : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────

export default function Home() {
  // Fusionar eventos base con los de Risaralda; enriquecer departamento si falta
  const allInitialEvents = useMemo(() =>
    mergeEvents(initialEvents, RISARALDA_EXTRA).map((e) => ({
      ...e,
      departamento: inferDepartamento(e),
    })),
    []
  );

  const [events, setEvents]                             = useState<Event[]>(allInitialEvents);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedMunicipio, setSelectedMunicipio]       = useState("");
  const [selectedMes, setSelectedMes]                   = useState("");
  const [searchQuery, setSearchQuery]                   = useState("");
  const [activeTab, setActiveTab]                       = useState<"eventos" | "calendario">("eventos");
  const [editingEvent, setEditingEvent]                 = useState<Event | null>(null);
  const [addingEvent, setAddingEvent]                   = useState(false);

  // ── Departamentos disponibles (dinámico, de los datos reales)
  const departamentos = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => { if (e.departamento) set.add(e.departamento); });
    return Array.from(set).sort();
  }, [events]);

  // ── PASO 1: Búsqueda libre — normalizada (sin tildes, case-insensitive)
  const afterSearch = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = normalize(searchQuery);
    return events.filter((e) =>
      [e.nombre, e.municipio, e.descripcion, e.departamento ?? "",
       e.territorio, e.fechas, e.secretaria ?? ""]
        .some((field) => normalize(field).includes(q))
    );
  }, [events, searchQuery]);

  // ── PASO 2: Departamentos con conteo (sobre afterSearch)
  const depConConteo = useMemo(() => {
    const map = new Map<string, number>();
    afterSearch.forEach((e) => {
      const d = e.departamento ?? "";
      if (d) map.set(d, (map.get(d) ?? 0) + 1);
    });
    return map;
  }, [afterSearch]);

  // ── PASO 3: Filtrar por departamento
  const afterDep = useMemo(() =>
    !selectedDepartamento ? afterSearch
      : afterSearch.filter((e) => e.departamento === selectedDepartamento),
    [afterSearch, selectedDepartamento]
  );

  // ── PASO 4: Municipios disponibles con conteo (sobre afterDep)
  const municipiosConConteo = useMemo(() => {
    const map = new Map<string, number>();
    afterDep.forEach((e) => map.set(e.municipio, (map.get(e.municipio) ?? 0) + 1));
    return map;
  }, [afterDep]);

  // ── PASO 5: Filtrar por municipio
  const afterMun = useMemo(() =>
    !selectedMunicipio ? afterDep
      : afterDep.filter((e) => e.municipio === selectedMunicipio),
    [afterDep, selectedMunicipio]
  );

  // ── PASO 6: Meses con eventos reales (sobre afterMun)
  const mesesDisponibles = useMemo(() => {
    const set = new Set<number>();
    afterMun.forEach((e) => { if (e.mes > 0) set.add(e.mes); });
    return MESES.filter((m) => set.has(parseInt(m.value)));
  }, [afterMun]);

  // ── PASO 7: Resultado final
  const filteredEvents = useMemo(() =>
    !selectedMes ? afterMun
      : afterMun.filter((e) => e.mes === parseInt(selectedMes)),
    [afterMun, selectedMes]
  );

  const hasActiveFilters = !!(selectedDepartamento || selectedMunicipio || selectedMes || searchQuery);

  const clearFilters = () => {
    setSelectedDepartamento(""); setSelectedMunicipio("");
    setSelectedMes(""); setSearchQuery("");
  };

  const handleDepChange = (val: string) => {
    // shadcn Select envía el valor actual cuando se re-selecciona; usamos esto para toggle
    setSelectedDepartamento((prev) => prev === val ? "" : val);
    setSelectedMunicipio("");
    setSelectedMes("");
  };

  const handleMunChange = (val: string) => {
    setSelectedMunicipio((prev) => prev === val ? "" : val);
    setSelectedMes("");
  };

  const handleMesChange = (val: string) => {
    setSelectedMes((prev) => prev === val ? "" : val);
  };

  // CRUD
  const handleSave   = (u: Event) => setEvents((p) => p.map((e) => e.id === u.id ? u : e));
  const handleAdd    = (n: Event) => setEvents((p) => [{
    ...n, departamento: inferDepartamento(n),
  }, ...p]);
  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este evento?")) setEvents((p) => p.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">

      {editingEvent && (
        <EventModal event={editingEvent} mode="edit"
          onSave={handleSave} onClose={() => setEditingEvent(null)} />
      )}
      {addingEvent && (
        <EventModal event={emptyEvent()} mode="add"
          onSave={handleAdd} onClose={() => setAddingEvent(false)} />
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 md:py-6">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                Ferias y Fiestas de Colombia
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Descubre las celebraciones culturales más representativas del Eje Cafetero, Antioquia y más regiones
              </p>
            </div>
            <Button onClick={() => setAddingEvent(true)} className="shrink-0 flex items-center gap-2 mt-1">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar evento</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">

          {/* ── Panel de filtros ── */}
          <div className="mb-8 p-5 md:p-6 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="ghost" size="sm" className="ml-auto text-xs">
                  <X className="w-3.5 h-3.5 mr-1" /> Limpiar filtros
                </Button>
              )}
            </div>

            {/* Búsqueda — normalizada sin tildes y case-insensitive */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por nombre, municipio, departamento, fechas... (sin importar mayúsculas o tildes)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selectores en cascada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Departamento */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-0.5 flex items-center justify-between">
                  <span>Departamento</span>
                  {selectedDepartamento && (
                    <button onClick={() => handleDepChange(selectedDepartamento)}
                      className="text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </label>
                <Select value={selectedDepartamento} onValueChange={handleDepChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Todos los departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((d) => (
                      <SelectItem key={d} value={d}>
                        <span className="flex items-center justify-between w-full gap-3">
                          <span>{d}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {depConConteo.get(d) ?? 0}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Municipio — depende de departamento */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold uppercase tracking-wider px-0.5 flex items-center justify-between ${
                  selectedDepartamento ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  <span>
                    Municipio
                    {selectedDepartamento && (
                      <span className="ml-1.5 font-normal normal-case tracking-normal text-muted-foreground/60">
                        ({municipiosConConteo.size} disponibles)
                      </span>
                    )}
                  </span>
                  {selectedMunicipio && (
                    <button onClick={() => handleMunChange(selectedMunicipio)}
                      className="text-primary hover:text-primary/60">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </label>
                <Select
                  value={selectedMunicipio}
                  onValueChange={handleMunChange}
                  disabled={!selectedDepartamento}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={
                      selectedDepartamento ? "Todos los municipios" : "← Elige un departamento"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(municipiosConConteo.entries())
                      .sort((a, b) => b[1] - a[1])
                      .map(([mun, count]) => (
                        <SelectItem key={mun} value={mun}>
                          <span className="flex items-center justify-between w-full gap-3">
                            <span>{mun}</span>
                            <span className="text-xs text-muted-foreground font-mono">{count}</span>
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mes — solo meses con eventos reales */}
              <div className="space-y-1">
                <label className={`text-[11px] font-semibold uppercase tracking-wider px-0.5 flex items-center justify-between ${
                  mesesDisponibles.length > 0 ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  <span>
                    Mes
                    {mesesDisponibles.length > 0 && (
                      <span className="ml-1.5 font-normal normal-case tracking-normal text-muted-foreground/60">
                        ({mesesDisponibles.length} con eventos)
                      </span>
                    )}
                  </span>
                  {selectedMes && (
                    <button onClick={() => setSelectedMes("")}
                      className="text-primary hover:text-primary/60">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </label>
                <Select
                  value={selectedMes}
                  onValueChange={handleMesChange}
                  disabled={mesesDisponibles.length === 0}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={
                      mesesDisponibles.length > 0 ? "Todos los meses" : "Sin meses disponibles"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {mesesDisponibles.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chips de filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground self-center">Activos:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    🔍 "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedDepartamento && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    📍 {selectedDepartamento}
                    <button onClick={() => handleDepChange(selectedDepartamento)} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedMunicipio && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    🏙️ {selectedMunicipio}
                    <button onClick={() => handleMunChange(selectedMunicipio)} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedMes && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    📅 {MESES.find((m) => m.value === selectedMes)?.label}
                    <button onClick={() => setSelectedMes("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Barra de resultado */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filteredEvents.length}</span>
                {" / "}
                <span className="font-medium text-foreground">{events.length}</span>
                {" eventos"}
                {hasActiveFilters && " coinciden"}
              </p>
              <div className="flex-1 max-w-40 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${events.length > 0 ? (filteredEvents.length / events.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Contador externo ── */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Eventos Encontrados</h2>
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} de {events.length} eventos{hasActiveFilters && " (filtrado)"}
              </p>
            </div>
            <Button variant="outline" onClick={() => setAddingEvent(true)}
              className="hidden md:flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar evento
            </Button>
          </div>

          {/* ── Grid de eventos ── */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id}
                  className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300">
                  <div className="flex-1"><EventCard event={event} /></div>
                  <div className="flex border-t border-border">
                    <button onClick={() => setEditingEvent(event)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                      <Pencil size={14} /> Editar
                    </button>
                    <div className="w-px bg-border" />
                    <button onClick={() => handleDelete(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Search className="w-8 h-8 text-primary/50" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">No se encontraron eventos</h3>
              <p className="text-muted-foreground mb-6">Intenta ajustar tus filtros de búsqueda</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={clearFilters} variant="outline" size="sm">Limpiar filtros</Button>
                <Button onClick={() => setAddingEvent(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Agregar evento
                </Button>
              </div>
            </div>
          )}

          {/* ── Tabs Eventos / Calendario ── */}
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex gap-2 mb-8">
              {(["eventos", "calendario"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}>
                  {tab === "eventos" ? <Search className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  {tab === "eventos" ? "Eventos" : "Calendario"}
                </button>
              ))}
            </div>
            {activeTab === "calendario" && <EventCalendar events={filteredEvents} />}
          </div>

          {/* ── Footer ── */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Sobre esta información</h4>
                <p className="text-muted-foreground">Datos recopilados de fuentes oficiales de alcaldías, gobernaciones y sitios de turismo de Colombia.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Territorios Cubiertos</h4>
                <p className="text-muted-foreground">Antioquia, Chocó, Risaralda, Quindío y Caldas — Eje Cafetero y región de Urabá.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Última Actualización</h4>
                <p className="text-muted-foreground">Abril 2026</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}