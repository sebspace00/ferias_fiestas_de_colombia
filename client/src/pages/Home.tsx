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
 
// ─────────────────────────────────────────────
// Tipos y helpers
// ─────────────────────────────────────────────
 
const DEPARTAMENTOS = ["Antioquia", "Chocó", "Risaralda", "Quindío", "Caldas"];
 
const MESES = [
  { value: "1",  label: "Enero"      }, { value: "2",  label: "Febrero"    },
  { value: "3",  label: "Marzo"      }, { value: "4",  label: "Abril"      },
  { value: "5",  label: "Mayo"       }, { value: "6",  label: "Junio"      },
  { value: "7",  label: "Julio"      }, { value: "8",  label: "Agosto"     },
  { value: "9",  label: "Septiembre" }, { value: "10", label: "Octubre"    },
  { value: "11", label: "Noviembre"  }, { value: "12", label: "Diciembre"  },
];
 
function emptyEvent(): Event {
  return {
    id: `custom-${Date.now()}`,
    nombre: "",
    municipio: "",
    territorio: "",
    departamento: "",
    fechas: "",
    descripcion: "",
    secretaria: "",
    telefono: "",
    correo: "",
    sitioweb: "",
    mes: 0,
    contacto: "",
  };
}
 
// ─────────────────────────────────────────────
// Modal reutilizable (Editar + Agregar)
// ─────────────────────────────────────────────
 
function EventModal({
  event,
  mode,
  onSave,
  onClose,
}: {
  event: Event;
  mode: "edit" | "add";
  onSave: (e: Event) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Event>({ ...event });
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>({});
 
  const set = (key: keyof Event, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));
 
  const validate = () => {
    const newErrors: Partial<Record<keyof Event, string>> = {};
    if (!form.nombre.trim())      newErrors.nombre      = "Requerido";
    if (!form.municipio.trim())   newErrors.municipio   = "Requerido";
    if (!form.territorio.trim())  newErrors.territorio  = "Requerido";
    if (!form.departamento?.trim()) newErrors.departamento = "Requerido";
    if (!form.fechas.trim())      newErrors.fechas      = "Requerido";
    if (!form.descripcion.trim()) newErrors.descripcion = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSave = () => {
    if (!validate()) return;
    // Si mes no fue seleccionado, intentar inferirlo del texto de fechas
    const finalForm = { ...form };
    if (!finalForm.mes || finalForm.mes === 0) finalForm.mes = 0;
    onSave(finalForm);
    onClose();
  };
 
  const title = mode === "add" ? "Agregar nuevo evento" : "Editar evento";
 
  const textFields: { label: string; key: keyof Event; required?: boolean }[] = [
    { label: "Nombre del evento",  key: "nombre",      required: true  },
    { label: "Departamento",       key: "departamento", required: true  },
    { label: "Territorio / Región",key: "territorio",  required: true  },
    { label: "Municipio",          key: "municipio",   required: true  },
    { label: "Fechas",             key: "fechas",      required: true  },
    { label: "Secretaría / Entidad organizadora", key: "secretaria" },
    { label: "Teléfono",           key: "telefono"    },
    { label: "Correo",             key: "correo"      },
    { label: "Sitio web",          key: "sitioweb"    },
    { label: "Contacto (nombre)",  key: "contacto"    },
  ];
 
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
 
        {/* Campos */}
        <div className="p-5 flex flex-col gap-4">
          {textFields.map(({ label, key, required }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground block mb-1">
                {label}{required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <Input
                value={String(form[key] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                className={errors[key] ? "border-rose-500" : ""}
              />
              {errors[key] && (
                <p className="text-xs text-rose-500 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
 
          {/* Mes */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Mes del evento</label>
            <select
              value={form.mes}
              onChange={(e) => set("mes", parseInt(e.target.value))}
              className="w-full text-sm p-2 border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={0}>Sin mes definido</option>
              {MESES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
 
          {/* Descripción */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Descripción <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              className={`w-full text-sm p-2 border rounded-md bg-background text-foreground resize-y outline-none focus:ring-1 focus:ring-primary font-sans ${
                errors.descripcion ? "border-rose-500" : "border-border"
              }`}
            />
            {errors.descripcion && (
              <p className="text-xs text-rose-500 mt-1">{errors.descripcion}</p>
            )}
          </div>
        </div>
 
        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            {mode === "add" ? "Agregar evento" : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
 
// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
 
export default function Home() {
  const [events, setEvents]                   = useState<Event[]>(initialEvents);
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("");
  const [selectedMunicipio, setSelectedMunicipio]       = useState<string>("");
  const [selectedTerritorio, setSelectedTerritorio]     = useState<string>("");
  const [selectedMes, setSelectedMes]                   = useState<string>("");
  const [searchQuery, setSearchQuery]                   = useState("");
  const [activeTab, setActiveTab]             = useState<"eventos" | "calendario">("eventos");
  const [editingEvent, setEditingEvent]       = useState<Event | null>(null);
  const [addingEvent, setAddingEvent]         = useState(false);
 
  // Municipios dinámicos según departamento seleccionado
  const municipiosFiltrados = useMemo(() => {
    if (!selectedDepartamento) return [];
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.departamento === selectedDepartamento) set.add(e.municipio);
    });
    return Array.from(set).sort();
  }, [events, selectedDepartamento]);
 
  // Territorios dinámicos según departamento seleccionado
  const territoriosFiltrados = useMemo(() => {
    if (!selectedDepartamento) return territorios;
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.departamento === selectedDepartamento) set.add(e.territorio);
    });
    return Array.from(set).sort();
  }, [events, selectedDepartamento]);
 
  // Filtrado principal
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchDep  = !selectedDepartamento || event.departamento === selectedDepartamento;
      const matchMun  = !selectedMunicipio    || event.municipio    === selectedMunicipio;
      const matchTer  = !selectedTerritorio   || event.territorio   === selectedTerritorio;
      const matchMes  = !selectedMes          || event.mes          === parseInt(selectedMes);
      const matchSearch =
        !searchQuery ||
        event.nombre.toLowerCase().includes(searchQuery.toLowerCase())      ||
        event.municipio.toLowerCase().includes(searchQuery.toLowerCase())    ||
        event.descripcion.toLowerCase().includes(searchQuery.toLowerCase())  ||
        event.departamento?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDep && matchMun && matchTer && matchMes && matchSearch;
    });
  }, [events, selectedDepartamento, selectedMunicipio, selectedTerritorio, selectedMes, searchQuery]);
 
  const hasActiveFilters =
    selectedDepartamento || selectedMunicipio || selectedTerritorio || selectedMes || searchQuery;
 
  const clearFilters = () => {
    setSelectedDepartamento("");
    setSelectedMunicipio("");
    setSelectedTerritorio("");
    setSelectedMes("");
    setSearchQuery("");
  };
 
  // Cambiar departamento y limpiar filtros dependientes
  const handleDepartamentoChange = (val: string) => {
    setSelectedDepartamento(val);
    setSelectedMunicipio("");
    setSelectedTerritorio("");
  };
 
  // CRUD
  const handleSave = (updated: Event) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };
 
  const handleAdd = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
  };
 
  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este evento?")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
 
      {/* Modal Editar */}
      {editingEvent && (
        <EventModal
          event={editingEvent}
          mode="edit"
          onSave={handleSave}
          onClose={() => setEditingEvent(null)}
        />
      )}
 
      {/* Modal Agregar */}
      {addingEvent && (
        <EventModal
          event={emptyEvent()}
          mode="add"
          onSave={handleAdd}
          onClose={() => setAddingEvent(false)}
        />
      )}
 
      {/* Header */}
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
            <Button
              onClick={() => setAddingEvent(true)}
              className="shrink-0 flex items-center gap-2 mt-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar evento</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </div>
        </div>
      </header>
 
      <main className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
 
          {/* Panel de filtros */}
          <div className="mb-8 p-5 md:p-6 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost" size="sm" className="ml-auto text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Limpiar filtros
                </Button>
              )}
            </div>
 
            {/* Búsqueda */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, municipio, departamento o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
 
            {/* Filtros en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 
              {/* Departamento */}
              <Select value={selectedDepartamento} onValueChange={handleDepartamentoChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Departamento..." />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
 
              {/* Municipio — dinámico */}
              <Select
                value={selectedMunicipio}
                onValueChange={setSelectedMunicipio}
                disabled={!selectedDepartamento}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue
                    placeholder={
                      selectedDepartamento ? "Municipio..." : "Primero selecciona un departamento"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {municipiosFiltrados.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
 
              {/* Territorio */}
              <Select value={selectedTerritorio} onValueChange={setSelectedTerritorio}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Territorio..." />
                </SelectTrigger>
                <SelectContent>
                  {territoriosFiltrados.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
 
              {/* Mes */}
              <Select value={selectedMes} onValueChange={setSelectedMes}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Mes..." />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
 
            {/* Chips de filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedDepartamento && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedDepartamento}
                    <button onClick={() => handleDepartamentoChange("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedMunicipio && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedMunicipio}
                    <button onClick={() => setSelectedMunicipio("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedTerritorio && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedTerritorio}
                    <button onClick={() => setSelectedTerritorio("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {selectedMes && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {MESES.find((m) => m.value === selectedMes)?.label}
                    <button onClick={() => setSelectedMes("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-primary/60">×</button>
                  </span>
                )}
              </div>
            )}
          </div>
 
          {/* Contador y botón agregar secundario */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                Eventos Encontrados
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} de {events.length} eventos
                {hasActiveFilters && " (filtrado)"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setAddingEvent(true)}
              className="hidden md:flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Agregar evento
            </Button>
          </div>
 
          {/* Grid de eventos */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex-1">
                    <EventCard event={event} />
                  </div>
                  <div className="flex border-t border-border">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <div className="w-px bg-border" />
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
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
              <p className="text-muted-foreground mb-6">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Limpiar filtros
                </Button>
                <Button onClick={() => setAddingEvent(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Agregar evento
                </Button>
              </div>
            </div>
          )}
 
          {/* Tabs Eventos / Calendario */}
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex gap-2 mb-8">
              {(["eventos", "calendario"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tab === "eventos" ? (
                    <Search className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  {tab === "eventos" ? "Eventos" : "Calendario"}
                </button>
              ))}
            </div>
            {activeTab === "calendario" && <EventCalendar events={filteredEvents} />}
          </div>
 
          {/* Footer info */}
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
                <p className="text-muted-foreground">Abril 2026</p>
              </div>
            </div>
          </div>
 
        </div>
      </main>
    </div>
  );
}