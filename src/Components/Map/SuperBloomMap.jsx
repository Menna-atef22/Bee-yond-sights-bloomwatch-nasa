import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ImageOverlay, LayersControl, Popup, ScaleControl, useMapEvents } from 'react-leaflet';
import Slider from 'rc-slider';
import chroma from 'chroma-js';
import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import './SuperBloomMap.module.css'; // Add CSS for legend and controls

const { Overlay } = LayersControl;

const years = [2019, 2020, 2021, 2022, 2023, 2024];
const layers = ['NDVI', 'EVI', 'Rainfall', 'Temperature', 'Fire', 'BloomStage'];

const colorScales = {
  NDVI: chroma.scale(['brown', 'yellow', 'green']).domain([0, 1]), // green to brown
  EVI: chroma.scale(['blue', 'yellow', 'red']).domain([0, 1]), // blue to red
  Rainfall: chroma.scale(['white', 'blue']).domain([0, 3000]),
  Temperature: chroma.scale(['blue', 'red']).domain([0, 40]),
  Fire: chroma.scale(['white', 'orange', 'red']).domain([0, 50]),
  BloomStage: chroma.scale(['yellow', 'pink', 'purple']).domain([0, 5]), // yellow to pink to purple
};

// Basemap options
const basemaps = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  sar: {
    name: 'SAR Imagery (Mock)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Placeholder, SAR would need real tiles
    attribution: 'Mock SAR Imagery'
  }
};

function SuperBloomMap() {
  const [selectedYear, setSelectedYear] = useState(2019);
  const [tiffData, setTiffData] = useState(null);
  const [overlays, setOverlays] = useState({});
  const [bounds, setBounds] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [basemap, setBasemap] = useState('osm');
  const [opacities, setOpacities] = useState(layers.reduce((acc, layer) => ({ ...acc, [layer]: 0.7 }), {}));
  const [mouseCoords, setMouseCoords] = useState({ lat: 0, lng: 0 });
  const animationRef = useRef(null);
  const mapRef = useRef(null);
  const [visibleLayers, setVisibleLayers] = useState(layers.reduce((acc, layer) => ({ ...acc, [layer]: true }), {}));
  const [csvData, setCsvData] = useState([]);
  const [yearlyAverages, setYearlyAverages] = useState({});
  const [allOverlays, setAllOverlays] = useState({});

  useEffect(() => {
    // Load CSV data once and compute yearly averages
    fetch('/SuperBloom_FullData_AllFeatures_Predicted.csv')
      .then(response => response.text())
      .then(text => {
        const rows = text.split('\n').slice(1); // Skip header
        const data = rows.map(row => {
          const cols = row.split(',');
          return {
            year: parseInt(cols[0]),
            month: parseInt(cols[1]),
            NDVI: parseFloat(cols[2]) || 0,
            EVI: parseFloat(cols[3]) || 0,
            Rainfall: parseFloat(cols[4]) || 0,
            Temperature: parseFloat(cols[5]) || 0,
            Fire: parseFloat(cols[6]) || 0, // Empty as 0
            BloomStage: parseFloat(cols[7]) || 0,
          };
        }).filter(row => !isNaN(row.year));
        setCsvData(data);

        // Compute yearly averages for all years
        const averages = {};
        const overlays = {};
        const mockWidth = 1000;
        const mockHeight = 800;
        years.forEach(year => {
          const yearData = data.filter(row => row.year === year);
          if (yearData.length > 0) {
            const layerAverages = {};
            layers.forEach(layer => {
              const values = yearData.map(row => row[layer]).filter(v => !isNaN(v) && v !== undefined);
              layerAverages[layer] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            });
            averages[year] = layerAverages;

            // Generate overlays for this year
            const yearOverlays = {};
            layers.forEach((layer, idx) => {
              const avg = layerAverages[layer];
              const canvas = document.createElement('canvas');
              canvas.width = mockWidth;
              canvas.height = mockHeight;
              const ctx = canvas.getContext('2d');
              const imageData = ctx.createImageData(canvas.width, canvas.height);
              const imgData = new Uint8ClampedArray(imageData.data);
              for (let i = 0; i < imgData.length / 4; i++) {
                const value = Math.max(0, Math.min(colorScales[layer].domain()[1], avg)); // Clamp value
                const color = colorScales[layer](value).rgba();
                const offset = i * 4;
                imgData[offset] = color[0];
                imgData[offset + 1] = color[1];
                imgData[offset + 2] = color[2];
                imgData[offset + 3] = 255;
              }
              ctx.putImageData(new ImageData(imgData, canvas.width, canvas.height), 0, 0);
              yearOverlays[layer] = canvas.toDataURL('image/png');
            });
            overlays[year] = yearOverlays;
          }
        });
        setYearlyAverages(averages);
        setAllOverlays(overlays);
      })
      .catch(err => {
        console.error('Error loading CSV:', err);
        setError('Failed to load CSV data');
      });
  }, []);

  useEffect(() => {
    if (Object.keys(yearlyAverages).length > 0 && allOverlays[selectedYear]) {
      setOverlays(allOverlays[selectedYear]);
      const layerAverages = yearlyAverages[selectedYear];
      const mockWidth = 1000;
      const mockHeight = 800;
      const mockBounds = [[32, -125], [42, -114]];
      setBounds(mockBounds);
      const rasters = layers.map(layer => {
        const avg = layerAverages[layer];
        const data = new Float32Array(mockWidth * mockHeight);
        data.fill(avg);
        return data;
      });
      setTiffData({ rasters: rasters, width: mockWidth, height: mockHeight, averages: layerAverages });
      setLoading(false);
    }
  }, [selectedYear, yearlyAverages, allOverlays]);

  const handleMapClick = (e) => {
    if (!tiffData || !bounds) return;
    const { lat, lng } = e.latlng;
    // Convert lat/lng to pixel coords (simplified, assuming linear)
    const latMin = bounds[0][0];
    const latMax = bounds[1][0];
    const lngMin = bounds[0][1];
    const lngMax = bounds[1][1];
    const x = Math.floor(((lng - lngMin) / (lngMax - lngMin)) * tiffData.width);
    const y = Math.floor(((latMax - lat) / (latMax - latMin)) * tiffData.height);
    const idx = Math.max(0, Math.min(y * tiffData.width + x, tiffData.rasters[0].length - 1));
    const data = {};
    layers.forEach((layer, i) => {
      data[layer] = tiffData.rasters[i][idx];
    });
    setPopupData({ lat, lng, year: selectedYear, ...data });
  };

  const startAnimation = () => {
    setAnimating(true);
    let idx = years.indexOf(selectedYear);
    const animate = () => {
      idx = (idx + 1) % years.length;
      setSelectedYear(years[idx]);
      if (animating) {
        animationRef.current = requestAnimationFrame(() => setTimeout(animate, 3000));
      }
    };
    animationRef.current = requestAnimationFrame(() => setTimeout(animate, 3000));
  };

  const stopAnimation = () => {
    setAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([37, -120], 10);
    }
  };

  if (error) {
    return <div>Error: {error}. Using mock data for demonstration.</div>;
  }

  // Component for mouse coordinates
  function MouseCoordinates() {
    useMapEvents({
      mousemove: (e) => {
        setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <div className="superbloom-map">
      <div className="side-panel">
        <div className="controls">
          <div className="slider-container">
            <label>Year: {selectedYear}</label>
            <Slider
              min={2019}
              max={2024}
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              marks={{ 2019: '2019', 2020: '2020', 2021: '2021', 2022: '2022', 2023: '2023', 2024: '2024' }}
            />
            <button onClick={animating ? stopAnimation : startAnimation} style={styles.Buttons}>
              {animating ? 'Stop Animation' : 'Start Animation'}
            </button>
            <button onClick={resetView} style={styles.Buttons}>
              Reset View
            </button>
          </div>
          <select className="basemap-select" value={basemap} onChange={(e) => setBasemap(e.target.value)}>
            {Object.keys(basemaps).map(key => (
              <option key={key} value={key}>{basemaps[key].name}</option>
            ))}
          </select>
          <div className="search-box">
            <input className="search-input" type="text" placeholder="Search location..." />
          </div>
        </div>
        <div className="legend">
          <h4>Legend</h4>
          {layers.map(layer => (
            <div key={layer} className="legend-item">
              <div className="legend-color" style={{ background: `linear-gradient(to right, ${colorScales[layer](0).hex()}, ${colorScales[layer](0.5).hex()}, ${colorScales[layer](1).hex()})` }}></div>
              <span>{layer}</span>
            </div>
          ))}
        </div>
        <div className="layer-controls">
          <h4>Layers</h4>
          {layers.map(layer => (
            <div key={layer} className="layer-control">
              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={visibleLayers[layer]}
                  onChange={(e) => setVisibleLayers(prev => ({ ...prev, [layer]: e.target.checked }))}
                />
                {layer}
              </label>
              <label>Opacity:</label>
              <Slider
                className="opacity-slider"
                min={0}
                max={1}
                step={0.1}
                value={opacities[layer]}
                onChange={(value) => setOpacities(prev => ({ ...prev, [layer]: value }))}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="map-container">
        {loading && <div className="loading-spinner">Loading map data for {selectedYear}...</div>}
        <MapContainer ref={mapRef} center={[37, -120]} zoom={10} style={{ height: '100%', width: '100%' }} onClick={handleMapClick}>
          <MouseCoordinates />
          <TileLayer
            attribution={basemaps[basemap].attribution}
            url={basemaps[basemap].url}
          />
          <ScaleControl position="bottomleft" />
          {tiffData && bounds && (
            <LayersControl position="topright">
              {layers.map(layer => (
                overlays[layer] && visibleLayers[layer] && (
                  <Overlay key={layer} checked={visibleLayers[layer]} name={layer}>
                    <ImageOverlay
                      url={overlays[layer]}
                      bounds={bounds}
                      opacity={opacities[layer]}
                    />
                  </Overlay>
                )
              ))}
            </LayersControl>
          )}
          <div className="coordinates">
            Lat: {mouseCoords.lat.toFixed(4)}, Lng: {mouseCoords.lng.toFixed(4)}
          </div>
          {popupData && (
            <Popup position={[popupData.lat, popupData.lng]} onClose={() => setPopupData(null)}>
              <div>
                <h3>Pixel Data for {popupData.year} (Yearly Average from CSV)</h3>
                <p>Lat: {popupData.lat?.toFixed(4)}, Lng: {popupData.lng?.toFixed(4)}</p>
                <p>NDVI: {popupData.NDVI?.toFixed(2)}</p>
                <p>EVI: {popupData.EVI?.toFixed(2)}</p>
                <p>Rainfall: {popupData.Rainfall?.toFixed(0)}mm</p>
                <p>Temperature: {popupData.Temperature?.toFixed(1)}°C</p>
                <p>Fire: {popupData.Fire?.toFixed(0)}</p>
                <p>BloomStage: {popupData.BloomStage?.toFixed(0)}</p>
                <p>Soil Moisture: {(Math.random() * 50).toFixed(1)}% (Mock)</p> {/* Mock additional data */}
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default SuperBloomMap;
