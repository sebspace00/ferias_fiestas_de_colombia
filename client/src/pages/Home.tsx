import { useState, useMemo } from "react";
import { events as initialEvents, territorios, Event } from "@/data/events";
import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import { EventMap } from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Map } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedTerritorio, setSelectedTerritorio] = useState<string>("");
  const [selectedMes, setSelectedMes] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"eventos" | "calendario" | "mapa">("eventos");

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchTerritorio =
        !selectedTerritorio || event.territorio === selectedTerritorio;
      const matchMes = !selectedMes || event.mes === parseInt(selectedMes);
      const matchSearch =
        !searchQuery ||
        event.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.municipio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTerritorio && matchMes && matchSearch;
    });
  }, [selectedTerritorio, selectedMes, searchQuery]);

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const hasActiveFilters =
    selectedTerritorio || selectedMes || searchQuery;

  const handleReset = () => {
    setSelectedTerritorio("");
    setSelectedMes("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 md:py-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
              Ferias y Fiestas de Colombia
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Descubre las celebraciones culturales más representativas de
              Quibdó, Urabá, Bajo Cauca, Medellín y el Valle de Aburrá
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Filters Section */}
          <div className="mb-8 p-5 md:p-6 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold">Filtros</h2>
              {hasActiveFilters && (
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, municipio o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Filter Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={selectedTerritorio} onValueChange={setSelectedTerritorio}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Seleccionar territorio..." />
                </SelectTrigger>
                <SelectContent>
                  {territorios.map((territorio) => (
                    <SelectItem key={territorio} value={territorio}>
                      {territorio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMes} onValueChange={setSelectedMes}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Seleccionar mes..." />
                </SelectTrigger>
                <SelectContent>
                  {meses.map((mes) => (
                    <SelectItem key={mes.value} value={mes.value}>
                      {mes.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
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
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredEvents.map((event) => (
  <div key={event.id} className="relative">
    
    <EventCard event={event} />

    <div className="absolute top-2 right-2 flex gap-2">
      <button
        onClick={() => alert("Edit coming next")}
        className="bg-white/80 hover:bg-white text-black text-xs px-2 py-1 rounded shadow"
      >
        ✏️
      </button>

      <button
        onClick={() =>
          setEvents(events.filter(e => e.id !== event.id))
        }
        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded shadow"
      >
        🗑
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
              <Button onClick={handleReset} variant="outline" size="sm">
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab("eventos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "eventos"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Search className="w-4 h-4" />
                Eventos
              </button>
              <button
                onClick={() => setActiveTab("calendario")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "calendario"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendario
              </button>
              <button
                onClick={() => setActiveTab("mapa")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "mapa"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Map className="w-4 h-4" />
                Mapa
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "calendario" && <EventCalendar events={filteredEvents} />}
            {activeTab === "mapa" && (
  <div className="p-6 text-center">
    Mapa desactivado temporalmente
  </div>
)}
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Sobre esta información
                </h4>
                <p className="text-muted-foreground">
                  Datos recopilados de fuentes oficiales de alcaldías,
                  gobernaciones y sitios de turismo de Colombia.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Territorios Cubiertos
                </h4>
                <p className="text-muted-foreground">
                  Chocó, Urabá, Bajo Cauca, Medellín y Valle de Aburrá
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Última Actualización
                </h4>
                <p className="text-muted-foreground">
                  Marzo 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
