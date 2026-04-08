import { useState, useMemo } from "react";
import { events as initialEvents, territorios, Event } from "@/data/events";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Pencil, Trash2 } from "lucide-react";

function EditModal({
  event,
  onSave,
  onClose,
}: {
  event: Event;
  onSave: (updated: Event) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...event });

  const set = (key: keyof Event, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-background-primary)",
          borderRadius: "12px",
          border: "0.5px solid var(--color-border-secondary)",
          padding: "1.5rem",
          width: "100%", maxWidth: "520px",
          maxHeight: "90vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>Editar evento</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--color-text-secondary)", lineHeight: 1, padding: "4px 8px" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { label: "Nombre del evento", key: "nombre" as keyof Event },
            { label: "Municipio", key: "municipio" as keyof Event },
            { label: "Fechas", key: "fechas" as keyof Event },
            { label: "Teléfono", key: "telefono" as keyof Event },
            { label: "Correo", key: "correo" as keyof Event },
            { label: "Sitio web", key: "sitioweb" as keyof Event },
          ].map(({ label, key }) => (
            <div key={key}>
              <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: "4px" }}>{label}</label>
              <input
                type="text"
                value={String(form[key] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                style={{ width: "100%", fontSize: "14px", padding: "8px 10px", boxSizing: "border-box", border: "0.5px solid var(--color-border-secondary)", borderRadius: "8px", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: "4px" }}>Descripción</label>
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              style={{ width: "100%", fontSize: "14px", padding: "8px 10px", boxSizing: "border-box", border: "0.5px solid var(--color-border-secondary)", borderRadius: "8px", background: "var(--color-background-primary)", color: "var(--color-text-primary)", resize: "vertical", outline: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "9px", fontSize: "14px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "8px", cursor: "pointer", color: "var(--color-text-primary)" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            style={{ flex: 1, padding: "9px", fontSize: "14px", background: "#D4537E", border: "none", borderRadius: "8px", cursor: "pointer", color: "#fff", fontWeight: 500 }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedTerritorio, setSelectedTerritorio] = useState<string>("");
  const [selectedMes, setSelectedMes] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"eventos" | "calendario">("eventos");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchTerritorio = !selectedTerritorio || event.territorio === selectedTerritorio;
      const matchMes = !selectedMes || event.mes === parseInt(selectedMes);
      const matchSearch =
        !searchQuery ||
        event.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.municipio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTerritorio && matchMes && matchSearch;
    });
  }, [events, selectedTerritorio, selectedMes, searchQuery]);

  const meses = [
    { value: "1", label: "Enero" }, { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" }, { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" }, { value: "6", label: "Junio" },
    { value: "7", label: "Julio" }, { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
  ];

  const hasActiveFilters = selectedTerritorio || selectedMes || searchQuery;

  const handleSave = (updated: Event) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este evento?")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {editingEvent && (
        <EditModal
          event={editingEvent}
          onSave={handleSave}
          onClose={() => setEditingEvent(null)}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 md:py-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
              Ferias y Fiestas de Colombia
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Descubre las celebraciones culturales más representativas de Quibdó, Urabá, Bajo Cauca, Medellín y el Valle de Aburrá
            </p>
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
                <Button onClick={() => { setSelectedTerritorio(""); setSelectedMes(""); setSearchQuery(""); }} variant="ghost" size="sm" className="ml-auto text-xs">
                  <X className="w-3.5 h-3.5 mr-1" /> Limpiar filtros
                </Button>
              )}
            </div>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, municipio o descripción..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={selectedTerritorio} onValueChange={setSelectedTerritorio}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Seleccionar territorio..." /></SelectTrigger>
                <SelectContent>{territorios.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedMes} onValueChange={setSelectedMes}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Seleccionar mes..." /></SelectTrigger>
                <SelectContent>{meses.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Eventos Encontrados</h2>
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} de {events.length} eventos{hasActiveFilters && " (filtrado)"}
              </p>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="relative group">
                  <EventCard event={event} />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setEditingEvent(event)}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "var(--color-background-primary)",
                        border: "0.5px solid var(--color-border-secondary)",
                        borderRadius: "8px", padding: "7px 14px",
                        fontSize: "13px", cursor: "pointer",
                        color: "var(--color-text-primary)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "#FBEAF0",
                        border: "0.5px solid #ED93B1",
                        borderRadius: "8px", padding: "7px 14px",
                        fontSize: "13px", cursor: "pointer",
                        color: "#993556",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Trash2 size={13} /> Eliminar
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
              <Button onClick={() => { setSelectedTerritorio(""); setSelectedMes(""); setSearchQuery(""); }} variant="outline" size="sm">Limpiar filtros</Button>
            </div>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <div className="flex gap-2 mb-8">
              {(["eventos", "calendario"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {tab === "eventos" ? <Search className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {activeTab === "calendario" && <EventCalendar events={filteredEvents} />}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div><h4 className="font-semibold text-foreground mb-2">Sobre esta información</h4><p className="text-muted-foreground">Datos recopilados de fuentes oficiales de alcaldías, gobernaciones y sitios de turismo de Colombia.</p></div>
              <div><h4 className="font-semibold text-foreground mb-2">Territorios Cubiertos</h4><p className="text-muted-foreground">Chocó, Urabá, Bajo Cauca, Medellín, Valle de Aburrá y municipios de Antioquia</p></div>
              <div><h4 className="font-semibold text-foreground mb-2">Última Actualización</h4><p className="text-muted-foreground">Abril 2026</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}