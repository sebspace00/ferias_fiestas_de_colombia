import { useState, useMemo, useEffect } from "react";
import type { Event } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Pencil, Trash2, Plus } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// AJUSTE ESTRATÉGICO — 16 ferias priorizadas con datos completos
// Tipo Event: id, nombre, municipio, territorio, fechas,
//             descripcion, secretaria, telefono, correo,
//             sitioweb, mes  (sin departamento ni contacto)
// ═══════════════════════════════════════════════════════════════
const STRATEGIC_EVENTS: Event[] = [
  {
    id: "st-medellin-001",
    nombre: "Feria de las Flores",
    municipio: "Medellín",
    territorio: "Valle de Aburrá",
    fechas: "31 de julio al 9 de agosto de 2026",
    descripcion: "La celebración más emblemática de Medellín. Durante 10 días la ciudad se llena de flores, música y tradición con el Desfile de Silleteros como acto central, Festival Nacional de la Trova, Desfile de Autos Clásicos, Feria a Ritmo de Bicicleta, mercados campesinos y actividades para toda la familia.",
    secretaria: "Secretaría de Cultura Ciudadana de Medellín",
    telefono: "(+57) 604 385 5406",
    correo: "convocatorias.cultura@medellin.gov.co",
    sitioweb: "https://www.medellin.gov.co",
    mes: 7,
  },
  {
    id: "st-envigado-001",
    nombre: "Fiestas del Carriel",
    municipio: "Envigado",
    territorio: "Valle de Aburrá",
    fechas: "12 al 20 de julio de 2026",
    descripcion: "Semana de la Cultura y Fiestas del Carriel en honor al símbolo más representativo de la identidad antioqueña. Desfile de Silleteros, Festival de la Trova Carriel de Oro, Fondas del Carriel, Muestra Gastronómica, conciertos, concurso de morcilla y empanada y actividades culturales en toda la ciudad.",
    secretaria: "Secretaría de Cultura de Envigado",
    telefono: "+57 (604) 3394000 Ext. 4419",
    correo: "ciudadano@envigado.gov.co",
    sitioweb: "https://www.envigado.gov.co",
    mes: 7,
  },
  {
    id: "st-bello-001",
    nombre: "Fiestas del Cerro Quita Sol",
    municipio: "Bello",
    territorio: "Valle de Aburrá",
    fechas: "17 al 28 de septiembre de 2026",
    descripcion: "Celebración en honor al cerro tutelar de Bello. 12 días con más de 1.500 artistas, Festival de la Trova, Festival de Tango, conciertos gratuitos en la Unidad Deportiva Tulio Ospina, Festival de Danza Urbana, Salón de Artes Visuales, Festival de Sancochos y Feria de Emprendimiento Manos que Inspiran.",
    secretaria: "Secretaría de Cultura de Bello",
    telefono: "+57 (604) 322 02 06",
    correo: "contactenos@bello.gov.co",
    sitioweb: "https://www.bello.gov.co",
    mes: 9,
  },
  {
    id: "st-itagui-001",
    nombre: "Fiestas de la Pereza",
    municipio: "Itagüí",
    territorio: "Valle de Aburrá",
    fechas: "8 al 16 de agosto de 2026",
    descripcion: "Fiestas de la Industria, el Comercio y la Cultura de Itagüí, que cierran con el mundialmente conocido Día de la Pereza (creado en 1985). Más de 120 eventos gratuitos: conciertos en el Estadio Ditaires, Festival Góspel, desfile de camas, body art, Festival de Cerveza y tablados barriales.",
    secretaria: "Instituto de Cultura, Recreación y Deporte de Itagüí",
    telefono: "+(57) 604 374 8196 Ext. 97-98",
    correo: "contactenos@itagui.gov.co",
    sitioweb: "https://itagui.gov.co",
    mes: 8,
  },
  {
    id: "st-sabaneta-001",
    nombre: "Fiestas del Plátano",
    municipio: "Sabaneta",
    territorio: "Valle de Aburrá",
    fechas: "22 de junio al 1 de julio de 2026",
    descripcion: "Celebración que honra el cultivo del plátano, motor histórico de la economía de Sabaneta. Nueve días con Sabaneta a la Carta (50+ restaurantes), conciertos nacionales, Festival de Sancochos, Sabaneta es Comedia, carrera atlética 5K y 10K, exposición de motos clásicas y muralismo urbano.",
    secretaria: "Secretaría de Educación y Cultura de Sabaneta",
    telefono: "+57 (604) 4406802 Ext. 1505",
    correo: "patricia.restrepo@sabaneta.gov.co",
    sitioweb: "https://sabaneta.gov.co",
    mes: 6,
  },
  {
    id: "st-caldas-001",
    nombre: "Fiestas del Aguacero",
    municipio: "Caldas",
    territorio: "Valle de Aburrá",
    fechas: "3 al 13 de octubre de 2026",
    descripcion: "Las Fiestas del Aguacero celebran la identidad del municipio conocido como Cielo Roto del sur del Valle de Aburrá. Noche de la Trova, Gran Cantinazo del Despecho, Festival Barrial de Sancochos, Festival Calcanta, Festival de Tattoo, Feria Artesanal y Gospel Caldas.",
    secretaria: "Casa Municipal de la Cultura de Caldas",
    telefono: "+57 604 4017301",
    correo: "direccion@culturacaldas.gov.co",
    sitioweb: "https://www.culturacaldas.gov.co",
    mes: 10,
  },
  {
    id: "st-copacabana-001",
    nombre: "Fiestas de la Naranja",
    municipio: "Copacabana",
    territorio: "Valle de Aburrá",
    fechas: "1 al 4 de noviembre de 2026",
    descripcion: "Celebración en honor a la naranja, cultivo emblema de Copacabana. Cuatro días de conciertos en la Unidad Deportiva Principal, Festival del Chorizo, Festival del Sancocho, Desfile de Motos y Bicicletas Clásicas, Caminata Canina, Feria de Emprendimiento y actividades en barrios y veredas. Ingreso gratuito.",
    secretaria: "Secretaría de Educación y Cultura de Copacabana",
    telefono: "(+57) 2741321 / 2744255",
    correo: "educacion@copacabana.gov.co",
    sitioweb: "https://www.copacabana.gov.co",
    mes: 11,
  },
  {
    id: "st-apartado-001",
    nombre: "Fiestas del Banano",
    municipio: "Apartadó",
    territorio: "Urabá",
    fechas: "Última semana de noviembre de 2026",
    descripcion: "Desde 1964, las Fiestas del Banano celebran el producto que define la identidad del Urabá antioqueño. Garruchódromo, Reinado Nacional del Banano, Festival de Trova y Humor, Festival Afrourbano, Fiesta del Campesino, muestra artesanal, gastronomía de derivados del banano y cabalgata.",
    secretaria: "Secretaría de Educación y Cultura de Apartadó",
    telefono: "+57 (604) 8283872",
    correo: "educacion@apartado.gov.co",
    sitioweb: "https://www.apartado-antioquia.gov.co",
    mes: 11,
  },
  {
    id: "st-caucasia-001",
    nombre: "Fiestas del Retorno",
    municipio: "Caucasia",
    territorio: "Bajo Cauca",
    fechas: "27 al 30 de noviembre de 2026",
    descripcion: "Celebración anual de la identidad caucasiana que convoca a los hijos del Bajo Cauca a reencontrarse con sus raíces. Desfiles de comparsas, conciertos, ferias artesanales, gastronomía típica y el regreso emotivo de las colonias que habitan en otras ciudades del país.",
    secretaria: "Secretaría de Educación, Cultura, Deporte, Recreación y Juventud",
    telefono: "+57 604 3788500",
    correo: "educacion@caucasia-antioquia.gov.co",
    sitioweb: "https://caucasia-antioquia.gov.co",
    mes: 11,
  },
  {
    id: "st-yarumal-001",
    nombre: "Fiestas del Yarumo",
    municipio: "Yarumal",
    territorio: "Antioquia",
    fechas: "26 al 29 de junio de 2026",
    descripcion: "Celebración en honor al árbol de yarumo, que da nombre a la Estrella del Norte antioqueña. Cuatro días de cultura, música y tradición con artistas nacionales como Nelson Velásquez y Jhonny Rivera, muestras folclóricas, gastronomía típica del norte antioqueño y actividades para toda la familia.",
    secretaria: "Secretaría de Cultura de Yarumal",
    telefono: "+57 (604) 8870100",
    correo: "alcaldia@yarumal.gov.co",
    sitioweb: "https://www.yarumal.gov.co",
    mes: 6,
  },
  {
    id: "st-rionegro-001",
    nombre: "Feria Aeronáutica F-AIR Colombia",
    municipio: "Rionegro",
    territorio: "Antioquia",
    fechas: "7 al 11 de julio de 2027 (bienal — próxima edición)",
    descripcion: "La Feria Internacional Aeronáutica y Espacial más importante de América Latina, en el Aeropuerto José María Córdova. Exhibición de aeronaves civiles y militares, demostraciones acrobáticas del equipo Arpía, conferencias aeroespaciales, zona comercial con expositores internacionales y espectáculos aéreos para el público general.",
    secretaria: "Aeronáutica Civil — Fuerza Aeroespacial Colombiana",
    telefono: "+57 (601) 4257700",
    correo: "info@f-aircolombia.com.co",
    sitioweb: "https://f-aircolombia.com.co",
    mes: 7,
  },
  {
    id: "st-laceja-001",
    nombre: "Fiestas del Toldo, las Bicicletas y las Flores",
    municipio: "La Ceja",
    territorio: "Antioquia",
    fechas: "3 al 13 de noviembre de 2026",
    descripcion: "Festividad emblemática del Oriente antioqueño que celebra los toldos tradicionales, la cultura ciclista y los cultivadores de flores. Desfile Nacional de Bicicletas en Flor, Festival de la Trova, El Tambo Rock, desfile de silleteros, Media Maratón Internacional, conciertos y gastronomía cejeña.",
    secretaria: "Dirección de Turismo de La Ceja",
    telefono: "+57 (604) 5531915",
    correo: "turismo@laceja-antioquia.gov.co",
    sitioweb: "https://www.laceja-antioquia.gov.co",
    mes: 11,
  },
  {
    id: "st-quibdo-001",
    nombre: "Fiestas de San Pacho",
    municipio: "Quibdó",
    territorio: "Chocó",
    fechas: "20 de septiembre al 5 de octubre de 2026",
    descripcion: "Patrimonio Cultural Inmaterial de la Humanidad (UNESCO 2012). Celebración en honor a San Francisco de Asís que fusiona la tradición católica con la cultura afrodescendiente del Pacífico. 16 días con alboradas, procesiones, comparsas, chirimía chocoana y arriada de banderas en los 12 barrios franciscanos de Quibdó.",
    secretaria: "Fundación Fiestas Franciscanas de Quibdó",
    telefono: "(+57) 604 6725731",
    correo: "contacto@quibdo-choco.gov.co",
    sitioweb: "https://www.quibdo-choco.gov.co",
    mes: 9,
  },
  {
    id: "st-pereira-001",
    nombre: "Fiestas de la Cosecha",
    municipio: "Pereira",
    territorio: "Risaralda",
    fechas: "15 al 31 de agosto de 2026",
    descripcion: "Celebración aniversaria de Pereira con más de 130 eventos. El Carnaval de la Cosecha, declarado Patrimonio Cultural de la Ciudad, es el acto central. Conciertos nacionales e internacionales, feria artesanal, gastronomía, desfiles y actividades deportivas. Uno de los eventos más importantes del Eje Cafetero.",
    secretaria: "Secretaría de Desarrollo Económico y Competitividad",
    telefono: "+57 3128262290",
    correo: "comunicaciones@pereira.gov.co",
    sitioweb: "https://www.pereira.gov.co",
    mes: 8,
  },
  {
    id: "st-armenia-001",
    nombre: "Fiestas del Yipao",
    municipio: "Armenia",
    territorio: "Quindío",
    fechas: "Junio de 2026 (aniversario 12 de junio)",
    descripcion: "Celebración del aniversario de Armenia con el Concurso Nacional del Yipao como acto central: los tradicionales jeeps Willys del Eje Cafetero desfilan cargados de objetos domésticos en un alarde de equilibrio y destreza. Declarado Patrimonio Cultural de la Nación. Incluye conciertos y feria gastronómica.",
    secretaria: "Secretaría de Cultura de Armenia",
    telefono: "+57 (606) 7412000",
    correo: "cultura@armenia.gov.co",
    sitioweb: "https://www.armenia.gov.co",
    mes: 6,
  },
  {
    id: "st-manizales-001",
    nombre: "Fiestas de Manizales",
    municipio: "Manizales",
    territorio: "Caldas",
    fechas: "Primera semana de enero de 2027",
    descripcion: "La Feria de Manizales es uno de los eventos culturales y taurinos más importantes de Colombia y América Latina. Corridas de toros en La Macarena, Reinado Internacional del Café, cabalgatas, conciertos internacionales, desfiles de comparsas y Feria de Negocios. Se celebra en la primera semana de enero.",
    secretaria: "Instituto de Cultura y Turismo de Manizales",
    telefono: "+57 (606) 8872000",
    correo: "cultura@manizales.gov.co",
    sitioweb: "https://www.manizales.gov.co",
    mes: 1,
  },
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEY = "ferias_fiestas_strategic_v1";

function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const MESES_MAP: Record<number, string> = {
  1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
  5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
  9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre",
};

const TODOS_LOS_MESES = Object.entries(MESES_MAP).map(([v, l]) => ({
  value: v, label: l, num: parseInt(v),
}));

function loadEvents(): Event[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Event[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* SSR o privado */ }
  return STRATEGIC_EVENTS;
}

function saveEvents(evs: Event[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evs)); } catch { /* silencioso */ }
}

// ═══════════════════════════════════════════════════════════════
// Modal Agregar / Editar
// ═══════════════════════════════════════════════════════════════
function emptyEvent(): Event {
  return {
    id: `custom-${Date.now()}`,
    nombre: "", municipio: "", territorio: "",
    fechas: "", descripcion: "", secretaria: "", telefono: "",
    correo: "", sitioweb: "", mes: 0,
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
    if (!form.nombre.trim())     e.nombre     = "Requerido";
    if (!form.municipio.trim())  e.municipio  = "Requerido";
    if (!form.territorio.trim()) e.territorio = "Requerido";
    if (!form.fechas.trim())     e.fechas     = "Requerido";
    if (!form.descripcion.trim()) e.descripcion = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fields: { label: string; key: keyof Event; required?: boolean }[] = [
    { label: "Nombre del evento",    key: "nombre",      required: true },
    { label: "Territorio / Región",  key: "territorio",  required: true },
    { label: "Municipio",            key: "municipio",   required: true },
    { label: "Fechas",               key: "fechas",      required: true },
    { label: "Secretaría / Entidad", key: "secretaria" },
    { label: "Teléfono",             key: "telefono"   },
    { label: "Correo",               key: "correo"     },
    { label: "Sitio web",            key: "sitioweb"   },
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
  const [events, setEventsRaw] = useState<Event[]>(() => loadEvents());

  const setEvents = (updater: Event[] | ((prev: Event[]) => Event[])) => {
    setEventsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveEvents(next);
      return next;
    });
  };

  useEffect(() => { saveEvents(events); }, []); // eslint-disable-line

  const [selectedTerritorio, setSelectedTerritorio] = useState("");
  const [selectedMunicipio,  setSelectedMunicipio]  = useState("");
  const [selectedMes,        setSelectedMes]        = useState("");
  const [searchQuery,        setSearchQuery]        = useState("");
  const [activeTab,          setActiveTab]          = useState<"eventos" | "calendario">("eventos");
  const [editingEvent,       setEditingEvent]       = useState<Event | null>(null);
  const [addingEvent,        setAddingEvent]        = useState(false);

  const afterSearch = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = normalize(searchQuery);
    return events.filter((e) =>
      [e.nombre, e.municipio, e.descripcion, e.territorio, e.fechas, e.secretaria]
        .some((field) => normalize(field).includes(q))
    );
  }, [events, searchQuery]);

  const territorioOptions = useMemo(() => {
    const map = new Map<string, number>();
    afterSearch.forEach((e) => map.set(e.territorio, (map.get(e.territorio) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([t, count]) => ({ value: t, label: t, count }));
  }, [afterSearch]);

  const afterTerr = useMemo(() =>
    !selectedTerritorio ? afterSearch
      : afterSearch.filter((e) => e.territorio === selectedTerritorio),
    [afterSearch, selectedTerritorio]
  );

  const munOptions = useMemo(() => {
    const map = new Map<string, number>();
    afterTerr.forEach((e) => map.set(e.municipio, (map.get(e.municipio) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([mun, count]) => ({ value: mun, label: mun, count }));
  }, [afterTerr]);

  const afterMun = useMemo(() =>
    !selectedMunicipio ? afterTerr
      : afterTerr.filter((e) => e.municipio === selectedMunicipio),
    [afterTerr, selectedMunicipio]
  );

  const mesOptions = useMemo(() => {
    const set = new Set<number>();
    afterMun.forEach((e) => { if (e.mes > 0) set.add(e.mes); });
    return TODOS_LOS_MESES.filter((m) => set.has(m.num));
  }, [afterMun]);

  const filteredEvents = useMemo(() =>
    !selectedMes ? afterMun
      : afterMun.filter((e) => e.mes === parseInt(selectedMes)),
    [afterMun, selectedMes]
  );

  const activeFilterCount = [selectedTerritorio, selectedMunicipio, selectedMes, searchQuery].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = () => {
    setSelectedTerritorio(""); setSelectedMunicipio("");
    setSelectedMes(""); setSearchQuery("");
  };

  const handleTerrChange = (val: string) => {
    setSelectedTerritorio((p) => p === val ? "" : val);
    setSelectedMunicipio(""); setSelectedMes("");
  };
  const handleMunChange = (val: string) => {
    setSelectedMunicipio((p) => p === val ? "" : val);
    setSelectedMes("");
  };

  const handleSave   = (u: Event) => setEvents((p) => p.map((e) => e.id === u.id ? u : e));
  const handleAdd    = (n: Event) => setEvents((p) => [n, ...p]);
  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este evento? El cambio se guardará permanentemente."))
      setEvents((p) => p.filter((e) => e.id !== id));
  };
  const handleReset = () => {
    if (confirm("¿Restaurar los 16 eventos originales? Se perderán los cambios manuales.")) {
      setEvents(STRATEGIC_EVENTS); clearFilters();
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

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 md:py-6">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                Ferias y Fiestas de Colombia
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Ajuste estratégico — 16 celebraciones prioritarias con datos completos
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

          <div className="mb-8 p-5 md:p-6 rounded-lg border border-border bg-card shadow-sm">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 px-0.5">
                  Territorio / Región
                  {selectedTerritorio && (
                    <button onClick={() => handleTerrChange(selectedTerritorio)}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
                    </button>
                  )}
                </label>
                <Select value={selectedTerritorio} onValueChange={handleTerrChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Todos los territorios" />
                  </SelectTrigger>
                  <SelectContent>
                    {territorioOptions.map(({ value, label, count }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{count}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 px-0.5 ${
                  selectedTerritorio ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  Municipio
                  {selectedTerritorio && <span className="ml-1 font-normal normal-case tracking-normal">({munOptions.length} disponibles)</span>}
                  {selectedMunicipio && (
                    <button onClick={() => handleMunChange(selectedMunicipio)}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
                    </button>
                  )}
                </label>
                <Select value={selectedMunicipio} onValueChange={handleMunChange} disabled={!selectedTerritorio}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={selectedTerritorio ? "Todos los municipios" : "← Elige un territorio"} />
                  </SelectTrigger>
                  <SelectContent>
                    {munOptions.map(({ value, label, count }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{count}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 px-0.5 ${
                  mesOptions.length > 0 ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  Mes
                  {mesOptions.length > 0 && <span className="ml-1 font-normal normal-case tracking-normal">({mesOptions.length} con eventos)</span>}
                  {selectedMes && (
                    <button onClick={() => setSelectedMes("")}
                      className="ml-2 text-primary hover:text-primary/60 font-normal normal-case tracking-normal">
                      <X className="w-3 h-3 inline" />
                    </button>
                  )}
                </label>
                <Select value={selectedMes} onValueChange={(v) => setSelectedMes((p) => p === v ? "" : v)} disabled={mesOptions.length === 0}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={mesOptions.length > 0 ? "Todos los meses" : "Sin eventos disponibles"} />
                  </SelectTrigger>
                  <SelectContent>
                    {mesOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 py-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground self-center mr-1">Activos:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    🔍 "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary/60 ml-0.5">×</button>
                  </span>
                )}
                {selectedTerritorio && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    📍 {selectedTerritorio}
                    <button onClick={() => handleTerrChange(selectedTerritorio)} className="hover:text-primary/60 ml-0.5">×</button>
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

            <div className={`flex items-center justify-between gap-4 ${hasActiveFilters ? "pt-3" : "pt-3 border-t border-border/50"}`}>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-base">{filteredEvents.length}</span>
                <span className="mx-1 text-muted-foreground/50">/</span>
                <span className="font-medium text-foreground">{events.length}</span>
                <span className="ml-1.5">eventos{hasActiveFilters ? " coinciden" : " en total"}</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${events.length > 0 ? (filteredEvents.length / events.length) * 100 : 0}%` }} />
                </div>
                <button onClick={handleReset}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline underline-offset-2">
                  Restaurar originales
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Eventos Encontrados</h2>
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} de {events.length} eventos{hasActiveFilters && " (filtrado)"}
              </p>
            </div>
            <Button variant="outline" onClick={() => setAddingEvent(true)} className="hidden md:flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar evento
            </Button>
          </div>

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
              <p className="text-muted-foreground mb-6">Intenta ajustar los filtros</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={clearFilters} variant="outline" size="sm">Limpiar filtros</Button>
                <Button onClick={() => setAddingEvent(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Agregar evento
                </Button>
              </div>
            </div>
          )}

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

          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Sobre esta información</h4>
                <p className="text-muted-foreground">Datos de fuentes oficiales: alcaldías, gobernaciones y sitios de turismo de Colombia.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Territorios Cubiertos</h4>
                <p className="text-muted-foreground">Antioquia, Chocó, Risaralda, Quindío y Caldas — {STRATEGIC_EVENTS.length} fiestas estratégicas.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Última Actualización</h4>
                <p className="text-muted-foreground">Mayo 2026 · {events.length} eventos</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}