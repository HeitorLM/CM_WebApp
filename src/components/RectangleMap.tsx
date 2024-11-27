import React from "react";
import { Rectangle, Popup, LayerGroup, useMap } from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import { LocationDB } from "../types";

interface RectangleMapProps {
    locations: LocationDB[];
}

export const RectangleMap: React.FC<RectangleMapProps> = ({ locations }) => {
    // Atualiza dinamicamente o mapa se necessário
    const map = useMap();

    return (
        <LayerGroup>
            {locations.map((loc) => {
                // Define os limites do retângulo
                const bounds: LatLngBoundsExpression = [
                    [loc.bottom, loc.left],
                    [loc.top, loc.right],
                ];

                return (
                    <Rectangle
                        key={loc.locationId}
                        bounds={bounds}
                        pathOptions={{
                            color: "#FF4500",
                            weight: 1,
                            fillOpacity: 0.2,
                        }}
                    >
                        <Popup>
                            <strong>{loc.name}</strong>
                            <br />
                            ID: {loc.locationId}
                        </Popup>
                    </Rectangle>
                );
            })}
        </LayerGroup>
    );
};
