import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { OccurrenceDB } from '../types';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapMarkerProps {
    occurrence: OccurrenceDB;
}

const icon = new Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const MapMarker: React.FC<MapMarkerProps> = ({ occurrence }) => {
    let position: LatLngExpression;
    if ((occurrence.locLatitude !== undefined && occurrence.locLatitude !== null) && (occurrence.locLongitude !== undefined && occurrence.locLongitude !== null)) {
        position = [occurrence.locLongitude, occurrence.locLatitude];

        // Transforma data
        const date = new Date(occurrence.timeStamp);
        const formattedDate = date.toLocaleDateString("pt-BR");
        const formattedTime = date.toLocaleTimeString("pt-BR");

        return (
            <Marker
                key={occurrence.occId} // Garantir chave única baseada no ID
                position={position}
                icon={icon}
            >
                <Popup>
                    <div>
                        <strong>Ocorrência #{occurrence.occId}</strong>
                        <p>{occurrence.subtype}</p>
                        <p>{formattedDate} {formattedTime}</p>
                        {occurrence.street && <p>Rua: {occurrence.street}</p>}
                        <p>Tipo: {occurrence.type}</p>
                        <p>Confiabilidade: {occurrence.reliability}/10</p>
                        <p>Confiança: {occurrence.confidence}/5</p>
                        <p>Local: {occurrence.city}</p>
                    </div>
                </Popup>
            </Marker>
        );
    } else {
        return (null);
    }
};
