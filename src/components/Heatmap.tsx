import React from "react";
import HeatmapLayer from "react-leaflet-heat-layer";
import { LatLngExpression } from "leaflet";
import { OccurrenceDB } from "../types";

interface HeatMapProps {
    occurrences: OccurrenceDB[];
}

export const MapHeatmap: React.FC<HeatMapProps> = ({ occurrences }) => {
    // Filtra ocorrências válidas e mapeia para o formato LatLngExpression
    const heatmapData: LatLngExpression[] = occurrences
        .filter(
            (occ) =>
                typeof occ.locLatitude === "number" &&
                typeof occ.locLongitude === "number" &&
                typeof occ.confidence === "number"
        )
        .map((occ) => [
            occ.locLongitude as number,
            occ.locLatitude as number,
            occ.reliability / 10,
        ]);

    if (heatmapData.length === 0) {
        // Retorna null se não houver dados para o heatmap
        return null;
    }

    return (
        <HeatmapLayer
            latlngs={heatmapData}
            // blur e radius podem não ser aceitos por tipos padrão, mas são propriedades suportadas
            {...{
                blur: 15,
                radius: 25,
                maxZoom: 15,        // Zoom máximo onde o heatmap será renderizado
                max: 1.0,           // Valor máximo de intensidade
                minOpacity: 0.3,    // Opacidade mínima para pontos de baixa intensidade
            }}
        />
    );
};
