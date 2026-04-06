import { useMemo, useState } from "react";
import { Event } from "@/data/events";
import { MapPin, X } from "lucide-react";

// Coordenadas aproximadas de municipios principales
const municipioCoordinates: { [key: string]: [number, number] } = {
  "Quibdó": [5.6969, -76.6561],
  "Apartadó": [7.8141, -76.6299],
  "Turbo": [8.0897, -76.7297],
  "San Juan de Urabá (Necoclí)": [8.3833, -76.8167],
  "Caucasia": [7.9833, -75.2],
  "El Bagre": [7.5667, -74.8],
  "Medellín": [6.2176, -75.5898],
  "Bello": [6.3333, -75.5333],
  "Itagüí": [6.1667, -75.6333],
  "Envigado": [6.1667, -75.6],
  "Sabaneta": [6.1333, -75.6667],
  "La Estrella": [6.1667, -75.7333],
  "Caldas": [6.0667, -75.7],
  "Copacabana": [6.3833, -75.5167],
  "Girardota": [6.4833, -75.4667],
  "Barbosa": [6.5833, -75.4],
};

interface EventMapProps {
  events: Event[];
}

interface MapMarker {
  municipio: string;
  coords: [number, number];
  count: number;
  events: Event[];
}

export function EventMap({ events }: EventMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const markers = useMemo(() => {
    const markerMap = new Map<string, MapMarker>();

    events.forEach((event) => {
      const coords = municipioCoordinates[event.municipio];
      if (coords) {
        const existing = markerMap.get(event.municipio);
        if (existing) {
          existing.count += 1;
          existing.events.push(event);
        } else {
          markerMap.set(event.municipio, {
            municipio: event.municipio,
            coords,
            count: 1,
            events: [event],
          });
        }
      }
    });

    return Array.from(markerMap.values());
  }, [events]);

  // Calculate bounds
  const bounds = useMemo(() => {
    if (markers.length === 0) return null;

    const lats = markers.map((m) => m.coords[0]);
    const lngs = markers.map((m) => m.coords[1]);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [markers]);

  // SVG dimensions and scaling
  const svgWidth = 800;
  const svgHeight = 600;

  const getPixelCoords = (lat: number, lng: number): [number, number] => {
    if (!bounds) return [0, 0];

    const padding = 60;
    const x =
      ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
        (svgWidth - padding * 2) +
      padding;
    const y =
      ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) *
        (svgHeight - padding * 2) +
      padding;

    return [x, y];
  };

  const selectedMarkerData = selectedMarker
    ? markers.find((m) => m.municipio === selectedMarker)
    : null;

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Mapa de Eventos
        </h2>
        <p className="text-sm text-muted-foreground">
          Ubicaciones de municipios con ferias y fiestas ({markers.length}{" "}
          municipios)
        </p>
      </div>

      {/* Map Container */}
      <div className="relative bg-secondary/30 border border-border rounded-lg overflow-hidden">
        <svg
          width="100%"
          height="600"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
        >
          {/* Grid background */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border/20"
              />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

          {/* Connection lines from center */}
          {markers.map((marker) => {
            const [x, y] = getPixelCoords(marker.coords[0], marker.coords[1]);
            return (
              <line
                key={`line-${marker.municipio}`}
                x1={svgWidth / 2}
                y1={svgHeight / 2}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4,4"
                className="text-primary/20"
              />
            );
          })}

          {/* Markers */}
          {markers.map((marker) => {
            const [x, y] = getPixelCoords(marker.coords[0], marker.coords[1]);
            const isSelected = selectedMarker === marker.municipio;
            const size = Math.min(15 + marker.count * 2, 35);

            return (
              <g
                key={marker.municipio}
                onClick={() => setSelectedMarker(marker.municipio)}
                className="cursor-pointer"
              >
                {/* Glow effect */}
                <circle
                  cx={x}
                  cy={y}
                  r={size + 8}
                  fill="currentColor"
                  className={`text-primary transition-all duration-200 ${
                    isSelected ? "opacity-30" : "opacity-0 group-hover:opacity-20"
                  }`}
                />

                {/* Main circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill="currentColor"
                  className={`text-primary transition-all duration-200 ${
                    isSelected ? "opacity-100" : "opacity-70 hover:opacity-90"
                  }`}
                />

                {/* Count text */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-xs font-bold fill-primary-foreground pointer-events-none"
                >
                  {marker.count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-secondary/30 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">
          Tamaño del círculo = cantidad de eventos. Haz clic para ver detalles.
        </p>
      </div>

      {/* Selected Marker Details */}
      {selectedMarkerData && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  {selectedMarkerData.municipio}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedMarkerData.count} evento
                {selectedMarkerData.count !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Events list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedMarkerData.events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="text-sm p-2 bg-background/50 rounded border border-border/50"
              >
                <p className="font-medium text-foreground text-xs mb-1">
                  {event.nombre}
                </p>
                <p className="text-xs text-muted-foreground">{event.fechas}</p>
              </div>
            ))}
            {selectedMarkerData.events.length > 5 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{selectedMarkerData.events.length - 5} eventos más
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
