import React from 'react';
import Plot from 'react-plotly.js';

function NDVIMap({ data }) {
  if (!data || data.length === 0) {
    return <div>Loading NDVI Map...</div>;
  }

  // Sort data by date
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group data by date for frames
  const groupedData = sortedData.reduce((acc, d) => {
    if (!acc[d.date]) {
      acc[d.date] = [];
    }
    acc[d.date].push(d);
    return acc;
  }, {});

  // Create frames
  const frames = Object.keys(groupedData).map(date => {
    const dayData = groupedData[date];
    return {
      name: date,
      data: [{
        type: 'scattermapbox',
        lat: dayData.map(d => d.lat),
        lon: dayData.map(d => d.lon),
        mode: 'markers',
        marker: {
          size: dayData.map(d => d.ndvi * 20),
          color: dayData.map(d => {
            if (d.bloom_phase === 'No Bloom') return 'gray';
            if (d.bloom_phase === 'Early Bloom') return 'yellow';
            return 'green';
          }),
          opacity: 0.7,
        },
        text: dayData.map(d => `NDVI: ${d.ndvi.toFixed(2)}, Phase: ${d.bloom_phase}`),
      }],
    };
  });

  // Initial data (first frame)
  const initialData = frames[0].data;

  const layout = {
    mapbox: {
      style: 'carto-positron',
      center: { lat: 37, lon: -120 },
      zoom: 5,
    },
    title: 'NDVI Bloom Map Over Time',
    updatemenus: [{
      type: 'buttons',
      buttons: [{
        label: 'Play',
        method: 'animate',
        args: [null, { mode: 'immediate', frame: { duration: 500, redraw: true }, fromcurrent: true, transition: { duration: 300 } }],
      }, {
        label: 'Pause',
        method: 'animate',
        args: [[null], { mode: 'immediate', frame: { duration: 0, redraw: true }, transition: { duration: 0 } }],
      }],
    }],
    sliders: [{
      active: 0,
      steps: frames.map((frame, i) => ({
        method: 'animate',
        args: [[frame.name], { mode: 'immediate', frame: { duration: 500, redraw: true }, transition: { duration: 300 } }],
        label: frame.name,
      })),
    }],
  };

  return (
    <Plot
      data={initialData}
      layout={layout}
      frames={frames}
      style={{ width: '100%', height: '600px' }}
      config={{ responsive: true }}
    />
  );
}

export default NDVIMap;
