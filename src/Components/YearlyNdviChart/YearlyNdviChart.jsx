import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// UPDATED: Component now accepts a 'variable' prop to be dynamic
function YearlyNdviChart({ data, variable }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const monthlyData = data.reduce((acc, event) => {
            const monthIndex = event.month - 1;
            if (!acc[monthIndex]) {
                acc[monthIndex] = { sum: 0, count: 0 };
            }
            // Use the dynamic variable key here
            if (event[variable] !== undefined && event[variable] !== null) {
                acc[monthIndex].sum += event[variable];
                acc[monthIndex].count++;
            }
            return acc;
        }, []);

        return monthNames.map((name, index) => {
            const month = monthlyData[index];
            const average = month && month.count > 0 ? (month.sum / month.count) : 0;
            
            let displayValue = average;
            // Only convert NDVI and BloomStage to percentage
            if (variable === 'NDVI' || variable === 'BloomStage') {
                displayValue = average * 100;
            }

            return {
                month: name,
                // Use the variable name as the key for the data
                [variable]: parseFloat(displayValue.toFixed(2)),
            };
        });
    }, [data, variable]);

    // --- Dynamic Formatting ---
    const getUnit = (v) => {
        if (v === 'NDVI' || v === 'BloomStage') return '%';
        if (v === 'Temperature') return ' °C';
        if (v === 'Rainfall') return ' mm';
        if (v === 'Pressure_api') return ' hPa';
        return '';
    };
    
    const unit = getUnit(variable);
    const tooltipFormatter = (value) => `${value.toFixed(2)}${unit.trim()}`;
    const legendName = Object.entries(dataVariables).find(([_, key]) => key === variable)?.[0] || variable;

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit={unit} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                {/* UPDATED: DataKey and Name are now dynamic */}
                <Line type="monotone" dataKey={variable} name={legendName} stroke="#27ae60" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// Add the same variable mapping here for the chart's reference
const dataVariables = {
    'NDVI': 'NDVI',
    'EVI': 'EVI',
    'Rainfall': 'Rainfall',
    'Temperature': 'Temperature',
    'Bloom Stage': 'BloomStage',
    'Pressure': 'Pressure_api'
};

export default YearlyNdviChart;

