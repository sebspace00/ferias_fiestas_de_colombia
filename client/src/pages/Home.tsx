import { useState, useMemo, useEffect } from "react";
import { events as initialEvents, Event } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Pencil, Trash2, Plus } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// EVENTOS RISARALDA — fuente: Excel proporcionado
// IDs con prefijo "rs-" para evitar colisión con events.ts
// ═══════════════════════════════════════════════════════════════
const RISARALDA_EXTRA: Event[] = [
  {
    id: "rs-pereira-001",
    nombre: "Fiestas de la Cosecha",
    municipio: "Pereira",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "15-31 de agosto",
    descripcion:
      "Celebración aniversaria de Pereira con más de 130 eventos: Carnaval de la Cosecha (Patrimonio Cultural de la Ciudad), conciertos nacionales e internacionales, feria artesanal, gastronomía, desfiles y actividades deportivas.",
    secretaria: "Secretaría de Desarrollo Económico y Competitividad",
    telefono: "3128262290",
    correo: "comunicaciones@pereira.gov.co",
    sitioweb: "https://www.pereira.gov.co",
    mes: 8,
    contacto: "Kelly Jhoana García Urueta",
  },
  {
    id: "rs-santarosa-001",
    nombre: "Fiestas Aniversarias de las Araucarias",
    municipio: "Santa Rosa de Cabal",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "5-14 de octubre",
    descripcion:
      "Celebración aniversaria de Santa Rosa de Cabal con Festival del Chorizo, Desfile del Yipao, Cabal Fest con artistas nacionales e internacionales y megaconcierto de clausura. Homenaje al legado de los 'hueveros'.",
    secretaria: "Alcaldía Municipal de Santa Rosa de Cabal",
    telefono: "3218803071",
    correo: "alcaldia@santarosadecabal-risaralda.gov.co",
    sitioweb: "https://www.santarosadecabal-risaralda.gov.co",
    mes: 10,
    contacto: "Juan Pablo Toro",
  },
  {
    id: "rs-apia-001",
    nombre: "La Calle del Café",
    municipio: "Apía",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Noviembre",
    descripcion:
      "Festival cafetero que reúne a caficultores, baristas y autoridades. Más de 40 marcas de cafés especiales, concursos de catación y Aeropress, feria gastronómica y rueda de negocios.",
    secretaria: "Alcaldía Municipal de Apía",
    telefono: "3159269523",
    correo: "danielerendonv@gmail.com",
    sitioweb: "https://www.apia-risaralda.gov.co",
    mes: 11,
    contacto: "Daniel Rendón",
  },
  {
    id: "rs-belenumbria-001",
    nombre: "Fiestas de la Caficultura",
    municipio: "Belén de Umbría",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Agosto",
    descripcion:
      "Celebración aniversaria del primer productor de café de Risaralda. Incluye la Marcha del Arraigo Belumbrense, Festival de Danza Folclórica 'Zarandiando', Noche de Gala y muestras artísticas.",
    secretaria: "Dirección Municipal de Cultura y Deporte",
    telefono: "3117486503",
    correo: "didiego23@hotmail.com",
    sitioweb: "https://www.belendeumbria-risaralda.gov.co",
    mes: 8,
    contacto: "Diego Gómez",
  },
  {
    id: "rs-lavirginia-001",
    nombre: "Fiestas del Río Cauca",
    municipio: "La Virginia",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Agosto",
    descripcion:
      "Festival que celebra la identidad del 'Puerto Dulce de Colombia'. Incluye actividades acuáticas, gastronomía típica de pescado (Viudo de Pescado) y cultura ribereña.",
    secretaria: "Alcaldía Municipal de La Virginia",
    telefono: "3186529159",
    correo: "comunicaciones@lavirginia-risaralda.gov.co",
    sitioweb: "https://www.lavirginia-risaralda.gov.co",
    mes: 8,
    contacto: "Diego Mauricio Soto",
  },
  {
    id: "rs-lavirginia-002",
    nombre: "Fiestas Aniversarias del Sol, Río y la Arena",
    municipio: "La Virginia",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "Noviembre",
    descripcion:
      "Celebración del aniversario de La Virginia con Desfile de Canoas por el río Cauca, Reinado Señorita Virginia, Muestra Artesanal, Muestra Gastronómica, Cabalgata Aniversaria y conciertos con orquestas nacionales.",
    secretaria: "Alcaldía Municipal de La Virginia",
    telefono: "3186529159",
    correo: "comunicaciones@lavirginia-risaralda.gov.co",
    sitioweb: "https://www.lavirginia-risaralda.gov.co",
    mes: 11,
    contacto: "Diego Mauricio Soto",
  },
  {
    id: "rs-santuario-001",
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
    id: "rs-santuario-002",
    nombre: "Fiestas del Retorno",
    municipio: "Santuario",
    territorio: "Risaralda",
    departamento: "Risaralda",
    fechas: "22-25 de noviembre",
    descripcion:
      "Celebración aniversaria con recibimiento de colonias, bandas sinfónicas, Festival Departamental de Danza Folclórica, Desfile del Yipao y actividades deportivas. Celebra la identidad paisa del municipio.",
    secretaria: "Dirección Municipal de Cultura y Deporte",
    telefono: "3212813601",
    correo: "jharolguerrerovalencia@gmail.com",
    sitioweb: "https://www.santuario-risaralda.gov.co",
    mes: 11,
    contacto: "Jharol Guerrero Valencia",
  },
];

// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = "ferias_colombia_events_v1";

/** Normaliza texto: minúsculas + sin tildes para búsqueda robusta */
function normalize(str: string): string {
  return (str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Infiere departamento desde territorio cuando el campo no existe */
function inferDepartamento(e: Event): string {
  if (e.departamento?.trim()) return e.departamento.trim();
  const t = normalize(e.territorio ?? "");
  if (t.includes("choco") || t.includes("chocó"))           return "Chocó";
  if (t.includes("uraba") || t.includes("urabá"))           return "Antioquia";
  if (t.includes("bajo cauca"))                             return "Antioquia";
  if (t.includes("medellin") || t.includes("medellín"))     return "Antioquia";
  if (t.includes("aburrá") || t.includes("abarra") || t.includes("aburra")) return "Antioquia";
  if (t.includes("risaralda"))                              return "Risaralda";
  if (t.includes("quindio") || t.includes("quindío"))       return "Quindío";
  if (t.includes("caldas"))                                 return "Caldas";
  return "Antioquia";
}

/**
 * Verifica que un evento tenga todos los datos requeridos para mostrarse.
 * Se excluyen eventos con campos vacíos o con el placeholder "No encontrado".
 */
const INVALID_VALUES = new Set(["no encontrado", "", "no especificado", "diversas fechas"]);

function isComplete(ev: Event): boolean {
  const required: (keyof Event)[] = [
    "nombre", "municipio", "fechas", "descripcion",
    "secretaria", "telefono", "correo", "sitioweb",
  ];
  return required.every((field) => {
    const val = normalize(String(ev[field] ?? "").trim());
    return val.length > 0 && !INVALID_VALUES.has(val);
  });
}

/**
 * Construye la lista maestra sin duplicados.
 * Prioridad: RISARALDA_EXTRA sobre initialEvents (para que los datos
 * del Excel sobreescriban si hubiera un id duplicado).
 * Deduplicación secundaria por nombre+municipio normalizado.
 * Solo incluye eventos con todos los datos requeridos completos.
 */
function buildMasterList(base: Event[], extra: Event[]): Event[] {
  const byId      = new Map<string, Event>();
  const byNameMun = new Map<string, Event>();

  const add = (ev: Event) => {
    const enriched = { ...ev, departamento: inferDepartamento(ev) };
    if (!isComplete(enriched)) return; // ← excluir incompletos
    const key = `${normalize(enriched.nombre)}|${normalize(enriched.municipio)}`;
    if (!byNameMun.has(key)) {
      byId.set(enriched.id, enriched);
      byNameMun.set(key, enriched);
    }
  };

  // Extra primero → tienen prioridad
  extra.forEach(add);
  base.forEach(add);

  return Array.from(byId.values());
}

const MESES_MAP: Record<number, string> = {
  1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
  5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
  9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre",
};

const TODOS_LOS_MESES = Object.entries(MESES_MAP).map(([v, l]) => ({
  value: v, label: l, num: parseInt(v),
}));

// ═══════════════════════════════════════════════════════════════
// PERSISTENCIA — localStorage
// ═══════════════════════════════════════════════════════════════

function loadEvents(): Event[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Event[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Si localStorage falla (SSR, privado, etc.) usamos datos base
  }
  return buildMasterList(initialEvents, RISARALDA_EXTRA);
}

function saveEvents(evs: Event[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evs));
  } catch {
    // Silencioso si falla
  }
}

// ═══════════════════════════════════════════════════════════════
// MODAL AGREGAR / EDITAR
// ═══════════════════════════════════════════════════════════════

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
    setForm((p) => ({ ...p, [key]: value }));

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
    { label: "Nombre del evento",    key: "nombre",       required: true },
    { label: "Departamento",         key: "departamento", required: true },
    { label: "Territorio / Región",  key: "territorio",   required: true },
    { label: "Municipio",            key: "municipio",    required: true },
    { label: "Fechas",               key: "fechas",       required: true },
    { label: "Secretaría / Entidad", key: "secretaria" },
    { label: "Teléfono",             key: "telefono"   },
    { label: "Correo",               key: "correo"     },
    { label: "Sitio web",            key: "sitioweb"   },
    { label: "Contacto (nombre)",    key: "contacto"   },
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
          <button onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none px-2">×</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {fields.map(({ label, key, required }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground block mb-1">
                {label}{required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <Input value={String(form[key] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                className={errors[key] ? "border-rose-500" : ""} />
              {errors[key] && <p className="text-xs text-rose-500 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Mes del evento</label>
            <select value={form.mes}
              onChange={(e) => set("mes", parseInt(e.target.value))}
              className="w-full text-sm p-2 border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option value={0}>Sin mes definido</option>
              {TODOS_LOS_MESES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Descripción <span className="text-rose-500">*</span>
            </label>
            <textarea rows={4} value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              className={`w-full text-sm p-2 border rounded-md bg-background text-foreground resize-y outline-none focus:ring-1 focus:ring-primary font-sans ${
                errors.descripcion ? "border-rose-500" : "border-border"
              }`} />
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

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  // ── Estado principal cargado desde localStorage
  const [events, setEventsRaw] = useState<Event[]>(() => loadEvents());

  // Wrapper que persiste automáticamente cada cambio
  const setEvents = (updater: Event[] | ((prev: Event[]) => Event[])) => {
    setEventsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveEvents(next);
      return next;
    });
  };

  // Si localStorage estaba vacío al montar, aseguramos que los datos se guarden
  useEffect(() => {
    saveEvents(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtros
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedMunicipio,    setSelectedMunicipio]    = useState("");
  const [selectedMes,          setSelectedMes]          = useState("");
  const [searchQuery,          setSearchQuery]          = useState("");
  const [activeTab,            setActiveTab]            = useState<"eventos" | "calendario">("eventos");
  const [editingEvent,         setEditingEvent]         = useState<Event | null>(null);
  const [addingEvent,          setAddingEvent]          = useState(false);

  // ── PASO 1: Búsqueda libre — normalizada (sin tildes, case-insensitive)
  const afterSearch = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = normalize(searchQuery);
    return events.filter((e) =>
      [e.nombre, e.municipio, e.descripcion, e.departamento ?? "",
       e.territorio, e.fechas, e.secretaria ?? "", e.contacto ?? ""]
        .some((field) => normalize(field).includes(q))
    );
  }, [events, searchQuery]);

  // ── PASO 2: Departamentos disponibles con conteo
  const depOptions = useMemo(() => {
    const map = new Map<string, number>();
    afterSearch.forEach((e) => {
      const d = e.departamento ?? "";
      if (d) map.set(d, (map.get(d) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dep, count]) => ({ value: dep, label: dep, count }));
  }, [afterSearch]);

  // ── PASO 3: Filtrar por departamento
  const afterDep = useMemo(() =>
    !selectedDepartamento ? afterSearch
      : afterSearch.filter((e) => e.departamento === selectedDepartamento),
    [afterSearch, selectedDepartamento]
  );

  // ── PASO 4: Municipios disponibles con conteo (solo los del depa seleccionado)
  const munOptions = useMemo(() => {
    const map = new Map<string, number>();
    afterDep.forEach((e) => map.set(e.municipio, (map.get(e.municipio) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([mun, count]) => ({ value: mun, label: mun, count }));
  }, [afterDep]);

  // ── PASO 5: Filtrar por municipio
  const afterMun = useMemo(() =>
    !selectedMunicipio ? afterDep
      : afterDep.filter((e) => e.municipio === selectedMunicipio),
    [afterDep, selectedMunicipio]
  );

  // ── PASO 6: Meses disponibles — TODOS los del dataset filtrado hasta aquí
  //   Solo incluye meses que realmente tienen al menos 1 evento en afterMun
  //   mes === 0 = "sin fecha" → no aparece en el filtro pero SÍ en resultados
  const mesOptions = useMemo(() => {
    const set = new Set<number>();
    afterMun.forEach((e) => { if (e.mes && e.mes > 0) set.add(e.mes); });
    return TODOS_LOS_MESES.filter((m) => set.has(m.num));
  }, [afterMun]);

  // ── PASO 7: Resultado final
  const filteredEvents = useMemo(() => {
    if (!selectedMes) return afterMun;
    const mesNum = parseInt(selectedMes);
    return afterMun.filter((e) => e.mes === mesNum);
  }, [afterMun, selectedMes]);

  const activeFilterCount = [selectedDepartamento, selectedMunicipio, selectedMes, searchQuery]
    .filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = () => {
    setSelectedDepartamento(""); setSelectedMunicipio("");
    setSelectedMes(""); setSearchQuery("");
  };

  const handleDepChange = (val: string) => {
    setSelectedDepartamento((p) => p === val ? "" : val);
    setSelectedMunicipio("");
    setSelectedMes("");
  };
  const handleMunChange = (val: string) => {
    setSelectedMunicipio((p) => p === val ? "" : val);
    setSelectedMes("");
  };
  const handleMesChange = (val: string) => {
    setSelectedMes((p) => p === val ? "" : val);
  };

  // ── CRUD con persistencia automática
  const handleSave = (updated: Event) => {
    setEvents((p) => p.map((e) => e.id === updated.id ? { ...updated, departamento: inferDepartamento(updated) } : e));
  };

  const handleAdd = (newEv: Event) => {
    const enriched = { ...newEv, departamento: inferDepartamento(newEv) };
    setEvents((p) => {
      // Verificar duplicado por nombre+municipio antes de agregar
      const key = `${normalize(enriched.nombre)}|${normalize(enriched.municipio)}`;
      const exists = p.some((e) =>
        `${normalize(e.nombre)}|${normalize(e.municipio)}` === key
      );
      if (exists) {
        alert(`Ya existe un evento "${enriched.nombre}" en ${enriched.municipio}. Si deseas modificarlo, usa el botón Editar.`);
        return p;
      }
      return [enriched, ...p];
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este evento? Este cambio se guardará permanentemente.")) {
      setEvents((p) => p.filter((e) => e.id !== id));
    }
  };

  // Reset a datos originales (botón de emergencia)
  const handleReset = () => {
    if (confirm("¿Restaurar todos los eventos originales? Se perderán los cambios manuales.")) {
      const fresh = buildMasterList(initialEvents, RISARALDA_EXTRA);
      setEvents(fresh);
      clearFilters();
    }
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

      {/* ── HEADER ── */}
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
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <Button onClick={() => setAddingEvent(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar evento</span>
                <span className="sm:hidden">Agregar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">

          {/* ── PANEL DE FILTROS ── */}
          <div className="mb-8 p-5 md:p-6 rounded-lg border border-border bg-card shadow-sm">

            {/* Cabecera filtros */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              {hasActiveFilters && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold ml-1">
                  {activeFilterCount}
                </span>
              )}
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="ghost" size="sm" className="ml-auto text-xs">
                  <X className="w-3.5 h-3.5 mr-1" /> Limpiar todo
                </Button>
              )}
            </div>

            {/* Búsqueda — sin tildes, case-insensitive */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar sin importar mayúsculas o tildes: pereira, MEDELLIN, quibdó..."
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

              {/* DEPARTAMENTO */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 px-0.5">
                  Departamento
                  {selectedDepartamento && (
                    <button onClick={() => handleDepChange(selectedDepartamento)}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
                    </button>
                  )}
                </label>
                <Select value={selectedDepartamento} onValueChange={handleDepChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Todos los departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    {depOptions.map(({ value, label, count }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                            {count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MUNICIPIO — depende de departamento */}
              <div>
                <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 px-0.5 ${
                  selectedDepartamento ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  Municipio
                  {selectedDepartamento && (
                    <span className="ml-1 font-normal normal-case tracking-normal">
                      ({munOptions.length} disponibles)
                    </span>
                  )}
                  {selectedMunicipio && (
                    <button onClick={() => handleMunChange(selectedMunicipio)}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
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
                    {munOptions.map(({ value, label, count }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                            {count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MES — solo meses con eventos reales en el contexto actual */}
              <div>
                <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 px-0.5 ${
                  mesOptions.length > 0 ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  Mes
                  {mesOptions.length > 0 && (
                    <span className="ml-1 font-normal normal-case tracking-normal">
                      ({mesOptions.length} con eventos)
                    </span>
                  )}
                  {selectedMes && (
                    <button onClick={() => setSelectedMes("")}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
                    </button>
                  )}
                </label>
                <Select
                  value={selectedMes}
                  onValueChange={handleMesChange}
                  disabled={mesOptions.length === 0}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={
                      mesOptions.length > 0 ? "Todos los meses" : "Sin eventos disponibles"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {mesOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chips de filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 py-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground self-center mr-1">Activos:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    🔍 "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary/60 ml-0.5">×</button>
                  </span>
                )}
                {selectedDepartamento && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    📍 {selectedDepartamento}
                    <button onClick={() => handleDepChange(selectedDepartamento)} className="hover:text-primary/60 ml-0.5">×</button>
                  </span>
                )}
                {selectedMunicipio && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    🏙️ {selectedMunicipio}
                    <button onClick={() => handleMunChange(selectedMunicipio)} className="hover:text-primary/60 ml-0.5">×</button>
                  </span>
                )}
                {selectedMes && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    📅 {MESES_MAP[parseInt(selectedMes)]}
                    <button onClick={() => setSelectedMes("")} className="hover:text-primary/60 ml-0.5">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Barra de resultado */}
            <div className={`flex items-center justify-between gap-4 ${hasActiveFilters ? "pt-3" : "pt-3 border-t border-border/50"}`}>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-base">{filteredEvents.length}</span>
                <span className="mx-1 text-muted-foreground/50">/</span>
                <span className="font-medium text-foreground">{events.length}</span>
                <span className="ml-1.5">eventos{hasActiveFilters ? " coinciden" : " en total"}</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-32 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${events.length > 0 ? (filteredEvents.length / events.length) * 100 : 0}%` }}
                  />
                </div>
                <button onClick={handleReset}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline underline-offset-2">
                  Restaurar originales
                </button>
              </div>
            </div>
          </div>

          {/* ── CONTADOR Y BOTÓN SECUNDARIO ── */}
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

          {/* ── GRID DE EVENTOS ── */}
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
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-muted-foreground mb-6">Intenta ajustar los filtros</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={clearFilters} variant="outline" size="sm">Limpiar filtros</Button>
                <Button onClick={() => setAddingEvent(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Agregar evento
                </Button>
              </div>
            </div>
          )}

          {/* ── TABS ── */}
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

          {/* ── FOOTER ── */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Sobre esta información</h4>
                <p className="text-muted-foreground">
                  Datos recopilados de fuentes oficiales de alcaldías, gobernaciones y sitios de turismo de Colombia.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Territorios Cubiertos</h4>
                <p className="text-muted-foreground">
                  Antioquia, Chocó, Risaralda, Quindío y Caldas — Eje Cafetero y región de Urabá.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Última Actualización</h4>
                <p className="text-muted-foreground">Abril 2026 · {events.length} eventos</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}