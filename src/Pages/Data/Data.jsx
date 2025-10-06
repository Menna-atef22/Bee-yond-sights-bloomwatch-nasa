

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, BarChart, Bar } from 'recharts';
import Map from '../../Components/Map/Map.jsx';
import SuperBloomMap from '../../Components/Map/SuperBloomMap.jsx';
import styles from './Data.module.css';

function Data() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://v0-bloom-watch-earth-observation.vercel.app/"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Bloom Watch App"
      />
    </div>
  );
}

export default Data;
