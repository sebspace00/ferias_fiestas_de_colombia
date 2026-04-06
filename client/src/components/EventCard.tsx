import { Event } from "@/data/events";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Phone, Mail, Globe } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = () => {
    const text = `${event.nombre} - ${event.municipio}\n${event.fechas}\n${event.descripcion}`;
    if (navigator.share) {
      navigator.share({
        title: event.nombre,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300" />

      <div className="relative p-5 md:p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary leading-tight flex-1">
              {event.nombre}
            </h3>
          </div>

          {/* Location and Territory */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs md:text-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {event.municipio}
            </span>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
              {event.territorio}
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{event.fechas}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-foreground/80 mb-4">
          {event.descripcion}
        </p>

        {/* Contact Info - Expandable */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-3"
          >
            <span>Información de Contacto</span>
            <span
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {isExpanded && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {event.secretaria !== "No encontrado" && (
                <div className="text-xs md:text-sm">
                  <p className="font-semibold text-foreground/70">Secretaría:</p>
                  <p className="text-foreground">{event.secretaria}</p>
                </div>
              )}

              {event.telefono !== "No encontrado" && (
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${event.telefono.replace(/\D/g, "")}`}
                    className="text-primary hover:underline break-all"
                  >
                    {event.telefono}
                  </a>
                </div>
              )}

              {event.correo !== "No encontrado" && (
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${event.correo}`}
                    className="text-primary hover:underline break-all"
                  >
                    {event.correo}
                  </a>
                </div>
              )}

              {event.sitioweb !== "No encontrado" && (
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <a
                    href={event.sitioweb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    Sitio web oficial
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share Button */}
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="w-full text-xs md:text-sm"
          >
            Compartir Información
          </Button>
        </div>
      </div>
    </div>
  );
}
