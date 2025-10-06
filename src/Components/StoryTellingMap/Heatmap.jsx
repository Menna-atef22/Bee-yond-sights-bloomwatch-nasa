import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat'; // Extends L with the heatLayer

export default function Heatmap({ points = [], options = {} }) {
    const map = useMap();
    const heatLayerRef = useRef(null); // Use a ref to hold the layer instance

    useEffect(() => {
        if (!map) return;

        // Sanity check to ensure the plugin is loaded
        if (typeof L.heatLayer !== 'function') {
            console.error("leaflet.heat not loaded correctly.");
            return;
        }

        heatLayerRef.current = L.heatLayer([], {
            radius: 45,
            blur: 80,
            gradient: {
            0.4: '#ff0000ff', // Yellow
            0.6: '#ff8800ff', // GreenYellow
            0.8: '#008000', // Green
            1.0: '#006400'  // DarkGreen
          },
            ...options,
        }).addTo(map);

        // Cleanup function: remove the layer when the component is unmounted
        return () => {
            if (map && heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
            }
        };
    }, [map]); // Dependencies: only the map instance

    useEffect(() => {
        if (heatLayerRef.current) {
            const heatPoints = points.map((p) => [p.lat, p.lng, p.value ?? 0]);
            heatLayerRef.current.setLatLngs(heatPoints);
        }
    }, [points]); // Dependency: the points data
    useEffect(() => {
        if (heatLayerRef.current) {
            heatLayerRef.current.setOptions({ ...options });
        }
    }, [options]);

    return null;
}
