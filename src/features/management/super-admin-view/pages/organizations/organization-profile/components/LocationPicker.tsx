import { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Label } from '../../../../../../../components/Label.tsx';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export interface SelectedLocationData {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

interface LocationPickerProps {
    latitude?: number | null;
    longitude?: number | null;
    onSelectLocation: (data: SelectedLocationData) => void;
    label?: string;
    helperText?: string;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e: { latlng: { lat: number; lng: number } }) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function LocationPicker({
    latitude,
    longitude,
    onSelectLocation,
    label = 'Select Location on Map',
    helperText = 'Click anywhere on the map or drag the marker to set coordinates.',
}: LocationPickerProps) {
    const markerRef = useRef<L.Marker>(null);

    const defaultCenter: [number, number] = [latitude ?? 31.9038, longitude ?? 35.2034];

    const currentPosition: [number, number] = [
        latitude ?? defaultCenter[0],
        longitude ?? defaultCenter[1],
    ];

    const handleUpdateCoords = async (lat: number, lng: number) => {
        let detectedName = '';
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await res.json();
            detectedName = (data.display_name as string) || '';
        } catch {
            // Keep empty on network failure
        }

        const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        onSelectLocation({
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            name: detectedName,
            timezone: systemTimezone,
        });
    };

    const markerEvents = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker) {
                    const { lat, lng } = marker.getLatLng();
                    handleUpdateCoords(lat, lng);
                }
            },
        }),
        [],
    );

    return (
        <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>{label}</Label>

            <div className="h-64 w-full overflow-hidden rounded-lg border border-[#d3d3df]">
                <MapContainer
                    center={defaultCenter}
                    zoom={latitude && longitude ? 14 : 9}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                        draggable={true}
                        eventHandlers={markerEvents}
                        position={currentPosition}
                        ref={markerRef}
                        icon={markerIcon}
                    />

                    <MapClickHandler onMapClick={handleUpdateCoords} />
                </MapContainer>
            </div>

            <p className="text-[10px] text-[#777789]">{helperText}</p>
        </div>
    );
}
