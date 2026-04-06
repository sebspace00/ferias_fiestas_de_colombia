import { useMemo, useState } from "react";
import { Event } from "@/data/events";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCalendarProps {
  events: Event[];
}

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function EventCalendar({ events }: EventCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Count events by month
  const eventsByMonth = useMemo(() => {
    const counts: { [key: number]: Event[] } = {};
    for (let i = 0; i < 12; i++) {
      counts[i] = [];
    }
    events.forEach((event) => {
      if (event.mes > 0 && event.mes <= 12) {
        counts[event.mes - 1].push(event);
      }
    });
    return counts;
  }, [events]);

  const currentMonthEvents = eventsByMonth[selectedMonth] || [];

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Calendario de Eventos
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevMonth}
            variant="outline"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
            {meses[selectedMonth]}
          </span>
          <Button
            onClick={handleNextMonth}
            variant="outline"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
        {meses.map((mes, index) => (
          <button
            key={mes}
            onClick={() => setSelectedMonth(index)}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedMonth === index
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {mes.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            Eventos en {meses[selectedMonth]}
          </h3>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            {currentMonthEvents.length} eventos
          </span>
        </div>

        {currentMonthEvents.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentMonthEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-secondary/30 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
              >
                <p className="font-medium text-sm text-foreground mb-1">
                  {event.nombre}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {event.municipio}
                  </span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                    {event.fechas}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No hay eventos registrados en {meses[selectedMonth].toLowerCase()}
            </p>
          </div>
        )}
      </div>

      {/* Year Overview */}
      <div className="border-t border-border mt-6 pt-6">
        <h3 className="font-semibold text-foreground mb-4 text-sm">
          Distribución Anual
        </h3>
        <div className="flex items-end gap-1 h-24">
          {meses.map((mes, index) => {
            const count = eventsByMonth[index].length;
            const maxCount = Math.max(
              ...Object.values(eventsByMonth).map((e) => e.length)
            );
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div
                key={mes}
                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                onClick={() => setSelectedMonth(index)}
              >
                <div
                  className={`w-full rounded-t transition-all duration-200 ${
                    selectedMonth === index
                      ? "bg-primary"
                      : "bg-primary/40 group-hover:bg-primary/60"
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${mes}: ${count} eventos`}
                />
                <span className="text-xs text-muted-foreground font-medium">
                  {mes.substring(0, 1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
