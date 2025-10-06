import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion as m } from "framer-motion";
import Map from '../../Components/StoryTellingMap/Map.jsx'; // Re-added the interactive map
import RangeSlider from '../../Components/RangeSlider/RangeSlider.jsx';
import YearlyNdviChart from "../../Components/YearlyNdviChart/YearlyNdviChart.jsx";
import styles from './Storytelling.module.css';
import 'leaflet/dist/leaflet.css';


// --- Defining the selectable data variables ---
const dataVariables = {
    'NDVI': 'NDVI',
    'EVI': 'EVI',
    'Rainfall': 'Rainfall',
    'Temperature': 'Temperature',
    'Bloom Stage': 'BloomStage',
    'Pressure': 'Pressure_api'
};

const locationDataFiles = {
    'California': './data/CaliforniaData.json',
    'Brazil': './data/BrazilData.json',
    'Japan': './data/JapanData.json'
};

const locations = [
    { name: 'California', top: '40%', left: '18%' },
    { name: 'Brazil', top: '68%', left: '33%' },
    { name: 'Japan', top: '41%', left: '83%' }
];

// --- Landing Page with static image and animated divs ---
function LandingPage({ onSelect }) {
    return (
        <div className={styles.landingContainer}>
            <img 
                src="https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                className={styles.landingBgImage} 
                alt="World map at night" 
            />
            <div className={styles.landingOverlay}>
                <m.h1 className={styles.landingTitle} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>A Planet's Pulse</m.h1>
                <m.p className={styles.landingSubtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>Click a location to explore its environmental story.</m.p>
            </div>
            
            <div className={styles.pulseDot} style={{ top: '20%', left: '50%' }}></div>
            <div className={styles.pulseDot} style={{ top: '70%', left: '10%', animationDelay: '1s' }}></div>
            <div className={styles.pulseDot} style={{ top: '40%', left: '75%', animationDelay: '2s' }}></div>
            <div className={styles.pulseDot} style={{ top: '80%', left: '90%', animationDelay: '0.5s' }}></div>

            {locations.map(loc => (
                <button
                    key={loc.name}
                    className={styles.locationButton}
                    style={{ top: loc.top, left: loc.left }}
                    onClick={() => onSelect(loc.name)}
                >
                    <div className={styles.pin}></div>
                    <span>{loc.name}</span>
                </button>
            ))}
        </div>
    );
}


// --- The Main Storytelling Component ---
function Storytelling() {
    // --- State Management ---
    const [appState, setAppState] = useState('landing');
    const [narrativeData, setNarrativeData] = useState(null);
    const [allBloomEvents, setAllBloomEvents] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [dateRange, setDateRange] = useState({ min: 0, max: 0 });
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('California');
    const [isLoading, setIsLoading] = useState(false);
    const [isNarrativeOpen, setIsNarrativeOpen] = useState(true); // NEW: State for sidebar
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationFrame, setAnimationFrame] = useState(0);
    const [animationSpeed, setAnimationSpeed] = useState(250);
    const [selectedVariable, setSelectedVariable] = useState('NDVI');

    // --- Data Fetching ---
    useEffect(() => {
        if (appState !== 'story') return;

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [bloomResponse, narrativeResponse] = await Promise.all([
                    fetch(locationDataFiles[selectedLocation]),
                    fetch('./data/Narrative.json')
                ]);

                if (!bloomResponse.ok || !narrativeResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const bloomData = await bloomResponse.json();
                const narratives = await narrativeResponse.json();
                
                const standardizedData = bloomData.map(d => ({
                    ...d, 
                    year: d.year || d.YEAR, 
                    month: d.month || d.MONTH,
                    Rainfall: d.Rainfall ?? d['RAINFALL(mm)'],
                    Temperature: d.Temperature ?? d['TEMPERATURE(C)'],
                    BloomStage: d.BloomStage ?? d.BLOOMSTAGE,
                    Pressure_api: d.Pressure_api ?? d['PRESSURE(hPa)'],
                }));

                const sortedData = standardizedData.sort((a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1));
                
                setAllBloomEvents(sortedData);
                setNarrativeData(narratives);

                setDateRange({ min: 0, max: sortedData.length - 1 });
                setAnimationFrame(0);
                setActiveStep(0);
                setIsUserInteracting(false);
                setIsPlaying(false);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [selectedLocation, appState]);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setAppState('story');
    };

    // --- Memoized Derived State ---
    const storySteps = useMemo(() => {
        if (!narrativeData) return [];
        return narrativeData[selectedLocation] || [];
    }, [narrativeData, selectedLocation]);

    const yearlyChartData = useMemo(() => {
        if (!allBloomEvents.length || !storySteps.length) return {};
        const groupedData = {};
        storySteps.forEach(step => {
            groupedData[step.year] = allBloomEvents.filter(event => event.year === step.year);
        });
        return groupedData;
    }, [allBloomEvents, storySteps]);

    const variableMaxValues = useMemo(() => {
        if (!allBloomEvents.length) return {};
        const maxValues = {};
        Object.values(dataVariables).forEach(key => { maxValues[key] = -Infinity; });
        allBloomEvents.forEach(event => {
            Object.values(dataVariables).forEach(key => {
                if (event[key] > maxValues[key]) {
                    maxValues[key] = event[key];
                }
            });
        });
        return maxValues;
    }, [allBloomEvents]);

    const dateLabels = useMemo(() => {
        if (!allBloomEvents.length) return [];
        return allBloomEvents.map(e => {
            const month = new Date(e.year, e.month - 1).toLocaleString('default', { month: 'short' });
            return `${month}-${e.year}`;
        });
    }, [allBloomEvents]);

    const allTransformedBloomEvents = useMemo(() => {
        return allBloomEvents.map(e => ({
            geoCode: [e.lat, e.lon],
            value: e[selectedVariable],
            text: `Event from ${e.month}/${e.year}`,
            ...e
        }));
    }, [allBloomEvents, selectedVariable]);

    useEffect(() => {
        if (!allBloomEvents.length || isUserInteracting || isPlaying || !storySteps.length) return;
        const currentYear = storySteps[activeStep]?.year;
        if (!currentYear) return;

        const startIndex = allBloomEvents.findIndex(e => e.year === currentYear);
        const endIndex = allBloomEvents.findLastIndex(e => e.year === currentYear);
        if (startIndex !== -1) {
            setDateRange({ min: startIndex, max: endIndex });
            setAnimationFrame(startIndex);
        }
    }, [activeStep, allBloomEvents, isUserInteracting, isPlaying, storySteps]);

    useEffect(() => {
        if (!isPlaying) return;
        const intervalId = setInterval(() => {
            setAnimationFrame(prevFrame => (prevFrame >= dateRange.max ? dateRange.min : prevFrame + 1));
        }, animationSpeed);
        return () => clearInterval(intervalId);
    }, [isPlaying, dateRange, animationSpeed]);

    const displayedBloomEvents = useMemo(() => {
        if (isPlaying) {
            const currentDateLabel = dateLabels[animationFrame];
            if (!currentDateLabel) return [];
            return allTransformedBloomEvents.filter(e => {
                const eventDateLabel = `${new Date(e.year, e.month - 1).toLocaleString('default', { month: 'short' })}-${e.year}`;
                return eventDateLabel === currentDateLabel;
            });
        }
        return allTransformedBloomEvents.slice(dateRange.min, dateRange.max + 1);
    }, [dateRange, isPlaying, animationFrame, allTransformedBloomEvents, dateLabels]);
    
    const handleRangeChange = (min, max) => {
        setIsUserInteracting(true);
        setIsPlaying(false);
        setDateRange({ min, max });
        setAnimationFrame(min);
    };

    const handleStepInView = useCallback((index) => {
        setIsUserInteracting(false);
        setActiveStep(index);
    }, []);

    // --- Render Logic ---
    if (appState === 'landing') {
        return <LandingPage onSelect={handleLocationSelect} />;
    }
    
    if (isLoading || !storySteps.length) {
        return <div className={styles.loadingScreen}>Loading {selectedLocation} Data...</div>;
    }

    return (
        <div className={styles.storyContainer} key={selectedLocation}>
            <div className={`${styles.visualization} ${isNarrativeOpen ? styles.narrow : styles.full}`}>
                <div className={styles.locationSelector}>
                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                        {Object.keys(locationDataFiles).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>

                <button onClick={() => setIsNarrativeOpen(!isNarrativeOpen)} className={styles.narrativeToggle}>
                    {isNarrativeOpen ? 'Hide' : 'Show'} Story
                </button>

                <Map 
                    bloomEvents={displayedBloomEvents} 
                    animate={!isPlaying} 
                    maxHeatmapValue={variableMaxValues[selectedVariable]}
                    eventName={selectedVariable}
                />
                <div className={styles.sliderContainer}>
                   <div className={styles.animationControls}>
                        <div className={styles.variableSelector}>
                            {Object.entries(dataVariables).map(([displayName, keyName]) => (
                                <label key={keyName}>
                                    <input
                                        type="radio"
                                        name="variable"
                                        value={keyName}
                                        checked={selectedVariable === keyName}
                                        onChange={(e) => setSelectedVariable(e.target.value)}
                                    />
                                    <span>{displayName}</span>
                                </label>
                            ))}
                        </div>
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? "Pause" : "Play Animation"}
                        </button>
                        {isPlaying && <span className={styles.animationStatus}>Showing: {dateLabels[animationFrame]}</span>}
                        <div className={styles.speedControl}>
                            <label htmlFor="speed">Speed</label>
                            <input
                                type="range"
                                id="speed"
                                min="50"
                                max="1000"
                                step="50"
                                value={animationSpeed}
                                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <RangeSlider
                        labels={dateLabels}
                        minValue={dateRange.min}
                        maxValue={dateRange.max}
                        onRangeChange={handleRangeChange}
                    />
                </div>
            </div>
            <div className={`${styles.narrative} ${isNarrativeOpen ? styles.open : ''}`}>
                <div className={styles.narrativeIntro}>
                    <h1>A Planet's Pulse: {selectedLocation}</h1>
                    <p>Follow the story of this landscape through the years. Scroll down to see how climate patterns have shaped its vegetation and environment.</p>
                </div>
                {storySteps.map((step, index) => {
                    const dataForChart = yearlyChartData[step.year] || [];
                    return (
                        <StoryStep
                            key={`${selectedLocation}-${step.year}`}
                            index={index}
                            title={step.title}
                            descriptions={step.descriptions}
                            chartData={dataForChart}
                            variable={selectedVariable}
                            onInView={handleStepInView}
                        />
                    );
                })}
            </div>
        </div>
    );
}


// --- Helper Component for Scrollytelling ---
const StoryStep = React.memo(function StoryStep({ title, descriptions, onInView, chartData, index, variable }) {
   const { ref, inView } = useInView({
        threshold: 0.6,
        triggerOnce: false,
        onChange: (isInView) => {
            if (isInView) {
                onInView(index);
            }
        },
    });

    const descriptionText = descriptions[dataVariables[Object.keys(dataVariables).find(key => dataVariables[key] === variable)]] || `Data for ${variable} in this year shows notable trends.`;

    return (
        <m.div 
            ref={ref} 
            className={styles.storyStep}
            animate={{ opacity: inView ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
        > 
            <div className={styles.textContainer}>
                <h3>{title}</h3>
                <p>{descriptionText}</p>
            </div>
            <div className={styles.chartWrapper}>
                <div className={styles.chartContainer}>
                    <YearlyNdviChart data={chartData} variable={variable}/>
                </div>
            </div>
        </m.div>
    );
});

export default Storytelling;

