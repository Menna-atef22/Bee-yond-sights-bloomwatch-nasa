import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, CircleMarker } from "react-leaflet";
import Heatmap from "./Heatmap";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import { a } from "framer-motion/m";

const { BaseLayer } = LayersControl;

function Map({ bloomEvents = [] , animate = false, eventName="Bloom Event"}) {
  const basePoints = useMemo(
    () => bloomEvents.map((e) => ({ lat: e.geoCode[0], lng: e.geoCode[1], value:(!animate)? 5:  e.value ?? 1})),
    [bloomEvents]
  );

  // optional simple pulsing animation: vary value between 0.5 and 1.5
  const [points, setPoints] = useState(basePoints);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setPoints(basePoints);
  }, [basePoints]);

  useEffect(() => {
    if (!animate) return;

    let t = 0;
    const id = setInterval(() => {
      t += 0.12;
      const animated = basePoints.map((p, i) => {
        // each point can have a phase so they don't all pulse in sync
        const phase = (i * 0.6) % Math.PI;
        const val = 1 + 0.6 * Math.sin(t + phase);
        return { ...p, value: Math.max(0.1, val) };
      });
      setPoints(animated);
    }, 80);

    return () => clearInterval(id);
  }, [animate, basePoints]);

  return (
    <>
      <MapContainer center={[30.0444, 31.2357]}maxBounds={[
        [-90, -180],
        [90, 180]
      ]} zoom={2} minZoom={2} className={styles.earthMap}>
        <LayersControl position="topright">
          <BaseLayer checked name="Tiles">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>

        <Heatmap points={animate ? points : basePoints} options={{ radius: 70, blur: 60, max: 1, minZoom: 5, maxZoom: 10}} />
        {bloomEvents.map((Event, i) => (
          <CircleMarker
            key={i}
            center={Event.geoCode}
            radius={40}
            pathOptions={{ opacity: 0, fillOpacity: 0 }}
            maxZoom={10}
            eventHandlers={{
              click: () => {
                setSelectedEvent(Event);
                setIsModalOpen(true);
              },
            }}
          />
        ))}
      </MapContainer>
        {isModalOpen && selectedEvent && (
        <div className={styles['modal-overlay']} onClick={() => setIsModalOpen(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <h2>🌸 {eventName}</h2>
            <p>Details: {selectedEvent.text}</p>
            <p>Location: {`${Math.round(selectedEvent.geoCode[0]*100)/100}° N ${Math.round(selectedEvent.geoCode[1]*100)/100} ° E`}</p>
            {selectedEvent.value && <p>Intensity: {Math.round(selectedEvent.value* 1000) / 1000 }</p>}
            <button className={styles['close-button']} onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Map;