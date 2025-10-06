

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, BarChart, Bar } from 'recharts';
import Map from '../../Components/Map/Map.jsx';
import SuperBloomMap from '../../Components/Map/SuperBloomMap.jsx';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://dashboardd-rose.vercel.app/"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Bloom Watch App"
      />
    </div>
  );
}

export default Dashboard;
