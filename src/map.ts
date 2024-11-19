import { LatLngExpression } from 'leaflet';

export const MAP_CONFIG = {
    CENTER: [-23.55052, -46.633308] as LatLngExpression,
    ZOOM: 5,
    UPDATE_INTERVAL: 120000, // 2 minutes in milliseconds
    TILE_LAYER: {
        URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
} as const;