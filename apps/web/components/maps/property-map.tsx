"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";

type PropertyMarker = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status?: "green" | "orange" | "red";
};

interface PropertyMapProps {
  properties: PropertyMarker[];
  activePropertyId?: string;
  onMarkerClick?: (propertyId: string) => void;
}

export function PropertyMap({
  properties,
  activePropertyId,
  onMarkerClick
}: PropertyMapProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    id: "project-v0-maps-script"
  });
  const isConfigured = Boolean(googleMapsApiKey);

  const center = useMemo(() => {
    if (properties.length === 0) {
      return { lat: 20.5937, lng: 78.9629 };
    }
    const active =
      properties.find((property) => property.id === activePropertyId) ??
      properties[0];
    return { lat: active.latitude, lng: active.longitude };
  }, [properties, activePropertyId]);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        }
      ]
    }),
    []
  );

  if (!isConfigured) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl bg-slate-100 px-6 text-center text-sm text-slate-500">
        Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the portfolio map.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl bg-slate-100 text-sm text-slate-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={6}
      options={options}
    >
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={{ lat: property.latitude, lng: property.longitude }}
          onClick={() => onMarkerClick?.(property.id)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: property.id === activePropertyId ? 12 : 8,
            fillColor:
              property.status === "green"
                ? "#34d399"
                : property.status === "orange"
                  ? "#fbbf24"
                  : "#f87171",
            fillOpacity: 0.9,
            strokeWeight: 0
          }}
        />
      ))}
    </GoogleMap>
  );
}

