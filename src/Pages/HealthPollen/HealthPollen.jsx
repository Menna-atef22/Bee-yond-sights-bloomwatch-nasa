import React, { useState } from 'react';
// Note: recharts imports are not used in this specific logic but kept in case you add charts later
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import styles from './HealthPollen.module.css';

// --- Helper Components ---

const ChoiceScreen = ({ setCurrentView }) => (
    <div className={styles.container}>
        <div className={styles.choiceContainer}>
            <div className={styles.choiceHeader}>
                <h1 className={styles.mainTitle}>BloomWatch Services</h1>
                <p className={styles.subtitle}>Choose your area of interest to get personalized insights</p>
            </div>
            <div className={styles.choiceCards}>
                <div className={styles.choiceCard} onClick={() => setCurrentView('agricultural')}>
                    <div className={styles.choiceIcon}>🌾</div>
                    <h3 className={styles.cardTitle}>Agricultrual Model</h3>
                    <p className={styles.cardDescription}>Input detailed environmental data to predict crop health, pollen, and pest status using our advanced ML model.</p>
                    <button className={styles.choiceButton}>Use Crop Model</button>
                </div>
                <div className={styles.choiceCard} onClick={() => setCurrentView('pollen')}>
                    <div className={styles.choiceIcon}>🤧</div>
                    <h3 className={styles.cardTitle}>Pollen Risk Prediction</h3>
                    <p className={styles.cardDescription}>Provide key weather and vegetation data to get a localized pollen risk level prediction for a specific day.</p>
                    <button className={styles.choiceButton}>Use Pollen Model</button>
                </div>
            </div>
        </div>
    </div>
);


const AgriculturalForm = ({ setCurrentView, predictionFormData, handleAgriculturalFormChange, handleAgriculturalFormSubmit, isLoading }) => (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <button className={styles.backButton} onClick={() => setCurrentView('choice')}>← Back to Services</button>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Agricultural Model</h2>
                <p className={styles.subtitle}>Provide the following metrics to receive a model-based prediction.</p>
            </div>
            <form className={styles.predictionForm} onSubmit={handleAgriculturalFormSubmit}>
                <fieldset className={styles.fieldset}>
                    <legend>Climate</legend>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Humidity (%)</label><input type="number" step="any" name="Humidity_%" value={predictionFormData["Humidity_%"]} onChange={handleAgriculturalFormChange} placeholder="e.g., 65.5" min="0" max="100" required/></div>
                        <div className={styles.formGroup}><label>Rainfall (mm)</label><input type="number" step="any" name="Rainfall_m" value={predictionFormData["Rainfall_m"]} onChange={handleAgriculturalFormChange} placeholder="e.g., 5.2" min="0" max="1000" title="Assuming monthly rainfall in mm" required/></div>
                        <div className={styles.formGroup}><label>Temperature (°C)</label><input type="number" step="any" name="Temperature_C" value={predictionFormData["Temperature_C"]} onChange={handleAgriculturalFormChange} placeholder="e.g., 22.3" min="-20" max="60" required/></div>
                        <div className={styles.formGroup}><label>Wind Speed (m/s)</label><input type="number" step="any" name="WindSpeed_m/s" value={predictionFormData["WindSpeed_m/s"]} onChange={handleAgriculturalFormChange} placeholder="e.g., 3.1" min="0" max="100" required/></div>
                        <div className={styles.formGroup}><label>Solar Radiation</label><input type="number" step="any" name="SolarRadiation" value={predictionFormData["SolarRadiation"]} onChange={handleAgriculturalFormChange} placeholder="e.g., 18.5" min="0" max="100000000" title="Daily solar radiation (MJ/m²)" required/></div>
                    </div>
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <legend>Soil</legend>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Clay (%)</label><input type="number" step="any" name="Clay" value={predictionFormData.Clay} onChange={handleAgriculturalFormChange} placeholder="e.g., 30.2" min="0" max="100" required/></div>
                        <div className={styles.formGroup}><label>Sand (%)</label><input type="number" step="any" name="Sand" value={predictionFormData.Sand} onChange={handleAgriculturalFormChange} placeholder="e.g., 45.8" min="0" max="100" required/></div>
                        <div className={styles.formGroup}><label>Organic Carbon</label><input type="number" step="any" name="OrganicCarbon" value={predictionFormData.OrganicCarbon} onChange={handleAgriculturalFormChange} placeholder="e.g., 1.5" min="0" max="20" title="Soil Organic Carbon (%)" required/></div>
                        <div className={styles.formGroup}><label>Soil Moisture (%)</label><input type="number" step="any" name="SoilMoisture" value={predictionFormData.SoilMoisture} onChange={handleAgriculturalFormChange} placeholder="e.g., 28" min="0" max="100" title="Enter a value from 0 to 100" required/></div>
                    </div>
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <legend>Vegetation Indices</legend>
                    <div className={styles.formGrid}>
                         <div className={styles.formGroup}><label>EVI (Enhanced Vegetation)</label><input type="number" step="any" name="EVI" value={predictionFormData.EVI} onChange={handleAgriculturalFormChange} placeholder="e.g., 0.45" min="-1" max="1" required/></div>
                         <div className={styles.formGroup}><label>NDVI (Vegetation Greenness)</label><input type="number" step="any" name="NDVI" value={predictionFormData.NDVI} onChange={handleAgriculturalFormChange} placeholder="e.g., 0.68" min="-1" max="1" required/></div>
                         <div className={styles.formGroup}><label>NDWI (Vegetation Water)</label><input type="number" step="any" name="NDWI" value={predictionFormData.NDWI} onChange={handleAgriculturalFormChange} placeholder="e.g., 0.12" min="-1" max="1" required/></div>
                         <div className={styles.formGroup}><label>SAVI (Soil-Adjusted Vegetation)</label><input type="number" step="any" name="SAVI" value={predictionFormData.SAVI} onChange={handleAgriculturalFormChange} placeholder="e.g., 0.55" min="-1" max="1" required/></div>
                    </div>
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <legend>Time</legend>
                    <div className={styles.formGrid}>
                       <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                            <label>Date</label>
                            <input type="date" name="selectedDate" value={predictionFormData.selectedDate} onChange={handleAgriculturalFormChange} required/>
                        </div>
                    </div>
                </fieldset>
                <div className={styles.categoricalGrid}>
                    <fieldset className={styles.fieldset}>
                        <legend>Region</legend>
                        <div className={styles.radioGroup}>
                            {["East_Africa", "North_Africa", "South_Africa", "West_Africa"].map(region => (
                                <label key={region}><input type="radio" name="region" value={region} checked={predictionFormData.region === region} onChange={handleAgriculturalFormChange} required/> {region.replace('_', ' ')}</label>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>Season</legend>
                         <div className={styles.radioGroup}>
                            {["Spring", "Summer", "Autumn", "Winter"].map(season => (
                                <label key={season}><input type="radio" name="season" value={season} checked={predictionFormData.season === season} onChange={handleAgriculturalFormChange} required/> {season}</label>
                            ))}
                        </div>
                    </fieldset>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Analyzing...' : 'Get Crop Health Prediction'}
                </button>
            </form>
        </div>
    </div>
);

const AgriculturalResults = ({ setShowPredictionResults, predictionResult, predictionError }) => {
    
    const classMappings = {
        cropHealth: ['Diseased', 'Healthy', 'Stressed'],
        pollenLevel: ['High', 'Low', 'Moderate'],
        pestOutbreak: ['High', 'Low', 'No'],
    };

    const getPredictionDetails = () => {
        if (!predictionResult || !predictionResult.rawOutput) {
            return { health: {}, pollen: {}, pest: {} };
        }
        const [healthCode, pollenCode, pestCode] = predictionResult.rawOutput;
        const health = {
            prediction: classMappings.cropHealth[healthCode] || 'Unknown',
            cardClass: classMappings.cropHealth[healthCode] === 'Healthy' ? styles.successCard : (classMappings.cropHealth[healthCode] === 'Stressed' ? styles.moderateCard : styles.diseasedCard),
        };
        const pollen = {
            prediction: classMappings.pollenLevel[pollenCode] || 'Unknown',
            cardClass: classMappings.pollenLevel[pollenCode] === 'Low' ? styles.successCard : (classMappings.pollenLevel[pollenCode] === 'Moderate' ? styles.moderateCard : styles.diseasedCard),
        };
        const pest = {
            prediction: classMappings.pestOutbreak[pestCode] || 'Unknown',
            cardClass: classMappings.pestOutbreak[pestCode] === 'No' ? styles.successCard : (classMappings.pestOutbreak[pestCode] === 'Low' ? styles.moderateCard : styles.diseasedCard),
        };
        return { health, pollen, pest };
    };
    
    const { health, pollen, pest } = getPredictionDetails();

    return (
        <div className={styles.container}>
            <div className={styles.resultsContainer}>
                <button className={styles.backButton} onClick={() => setShowPredictionResults(false)}>← Back to Form</button>
                <div className={styles.resultsHeader}>
                    <h2 className={styles.formTitle}>Prediction Result</h2>
                    <p className={styles.subtitle}>Based on the environmental data you provided</p>
                </div>
                {predictionError && (
                    <div className={`${styles.resultCard} ${styles.errorCard}`}>
                        <h3>An Error Occurred</h3>
                        <p>{predictionError}</p>
                    </div>
                )}
                {predictionResult && (
                    <div className={styles.resultsGrid}>
                        <div className={`${styles.resultCard} ${health.cardClass}`}>
                            <h3>Predicted Crop Health:</h3>
                            <p className={styles.predictionValue}>{health.prediction}</p>
                        </div>
                        <div className={`${styles.resultCard} ${pollen.cardClass}`}>
                            <h3>Irrigation Need:</h3>
                            <p className={styles.predictionValue}>{pollen.prediction}</p>
                        </div>
                        <div className={`${styles.resultCard} ${pest.cardClass}`}>
                            <h3>Bloom Risk:</h3>
                            <p className={styles.predictionValue}>{pest.prediction}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PollenForm = ({ setCurrentView, pollenFormData, handlePollenFormChange, handlePollenFormSubmit, isPollenLoading }) => (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <button className={styles.backButton} onClick={() => setCurrentView('choice')}>← Back to Services</button>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Pollen Risk Prediction Model</h2>
                <p className={styles.subtitle}>Provide the following metrics for a localized pollen risk forecast.</p>
            </div>
            <form className={styles.predictionForm} onSubmit={handlePollenFormSubmit}>
                <fieldset className={styles.fieldset}>
                    <legend>Environmental Conditions</legend>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Temperature (°C)</label><input type="number" step="any" name="Temperature_C" value={pollenFormData.Temperature_C} onChange={handlePollenFormChange} placeholder="e.g., 25.1" required /></div>
                        <div className={styles.formGroup}><label>Wind Speed (m/s)</label><input type="number" step="any" name="WindSpeed_m/s" value={pollenFormData['WindSpeed_m/s']} onChange={handlePollenFormChange} placeholder="e.g., 4.5" required /></div>
                        <div className={styles.formGroup}><label>NDVI (Vegetation Greenness)</label><input type="number" step="any" name="NDVI" value={pollenFormData.NDVI} onChange={handlePollenFormChange} placeholder="e.g., 0.72" min="-1" max="1" required /></div>
                        <div className={styles.formGroup}><label>Humidity (%)</label><input type="number" step="any" name="Humidity_%" value={pollenFormData['Humidity_%']} onChange={handlePollenFormChange} placeholder="e.g., 55" min="0" max="100" required /></div>
                        <div className={styles.formGroup}><label>Rainfall (mm)</label><input type="number" step="any" name="Rainfall_m" value={pollenFormData.Rainfall_m} onChange={handlePollenFormChange} placeholder="e.g., 0.5" required /></div>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input type="date" name="pollenDate" value={pollenFormData.pollenDate} onChange={handlePollenFormChange} required/>
                        </div>
                    </div>
                </fieldset>
                <button type="submit" className={styles.submitButton} disabled={isPollenLoading}>
                    {isPollenLoading ? 'Analyzing...' : 'Get Pollen Risk Prediction'}
                </button>
            </form>
        </div>
    </div>
);

const PollenResults = ({ setShowPollenResults, pollenResult, pollenError }) => {
    const riskLevel = pollenResult?.prediction === 1 ? 'High Risk' : 'Low Risk';
    const cardClass = pollenResult?.prediction === 1 ? styles.diseasedCard : styles.successCard;

    return (
        <div className={styles.container}>
            <div className={styles.resultsContainer}>
                <button className={styles.backButton} onClick={() => setShowPollenResults(false)}>← Back to Form</button>
                <div className={styles.resultsHeader}>
                    <h2 className={styles.formTitle}>Pollen Risk Result</h2>
                    <p className={styles.subtitle}>Based on the data you provided</p>
                </div>
                {pollenError && (
                    <div className={`${styles.resultCard} ${styles.errorCard}`}>
                        <h3>An Error Occurred</h3>
                        <p>{pollenError}</p>
                    </div>
                )}
                {pollenResult && (
                    <div className={`${styles.resultCard} ${cardClass}`}>
                        <h3>Predicted Pollen Risk Level:</h3>
                        <p className={styles.predictionValue}>{riskLevel}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- The Main Component ---
const HealthPollen = () => {
    const [currentView, setCurrentView] = useState('choice');
    
    const [predictionFormData, setPredictionFormData] = useState({
        "Humidity_%": '65.5', "Rainfall_m": '5.2', "Temperature_C": '22.3',
        "WindSpeed_m/s": '3.1', "SolarRadiation": '18.5', "Clay": '30.2',
        "OrganicCarbon": '1.5', "Sand": '45.8', "SoilMoisture": '28',
        "EVI": '0.45', "NDVI": '0.68', "NDWI": '0.12', "SAVI": '0.55',
        "selectedDate": new Date().toISOString().split('T')[0],
        "region": 'South_Africa', "season": 'Spring'
    });
    const [showPredictionResults, setShowPredictionResults] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionError, setPredictionError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [pollenFormData, setPollenFormData] = useState({
        'Temperature_C': '25.1', 'WindSpeed_m/s': '4.5', 'NDVI': '0.72', 'Humidity_%': '55', 'Rainfall_m': '0.5',
        'pollenDate': new Date().toISOString().split('T')[0]
    });
    const [showPollenResults, setShowPollenResults] = useState(false);
    const [pollenResult, setPollenResult] = useState(null);
    const [pollenError, setPollenError] = useState(null);
    const [isPollenLoading, setIsPollenLoading] = useState(false);

    const handleAgriculturalFormChange = (e) => {
        const { name, value } = e.target;
        setPredictionFormData(prev => ({...prev, [name]: value }));
    };

    const handleAgriculturalFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPredictionError(null);
        setPredictionResult(null);

        const selectedDate = new Date(predictionFormData.selectedDate);
        const month = selectedDate.getMonth() + 1;
        const startOfYear = new Date(selectedDate.getFullYear(), 0, 0);
        const diff = selectedDate - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const day_of_year = Math.floor(diff / oneDay);
        const firstDayOfYear = new Date(selectedDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (selectedDate - firstDayOfYear) / 86400000;
        const week_number = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        const clay = Number(predictionFormData.Clay);
        const sand = Number(predictionFormData.Sand);
        const silt = Math.max(0, 100 - clay - sand);
        const soilMoistureDecimal = Number(predictionFormData.SoilMoisture) / 100;

        const features = [
            Number(predictionFormData["Humidity_%"]), Number(predictionFormData["Rainfall_m"]),
            Number(predictionFormData["Temperature_C"]), Number(predictionFormData["WindSpeed_m/s"]),
            Number(predictionFormData["SolarRadiation"]),
            clay, Number(predictionFormData["OrganicCarbon"]),
            sand, silt, soilMoistureDecimal,
            Number(predictionFormData["EVI"]), Number(predictionFormData["NDVI"]),
            Number(predictionFormData["NDWI"]), Number(predictionFormData["SAVI"]),
            week_number, month, day_of_year,
            predictionFormData.region === 'East_Africa' ? 1 : 0,
            predictionFormData.region === 'North_Africa' ? 1 : 0,
            predictionFormData.region === 'South_Africa' ? 1 : 0,
            predictionFormData.season === 'Autumn' ? 1 : 0,
            predictionFormData.season === 'Spring' ? 1 : 0,
            predictionFormData.season === 'Summer' ? 1 : 0,
        ];

        const payload = { features };
        
        try {
            const response = await fetch('https://lmazenahmedl-bloomwatch.hf.space/predict/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.details || 'Network response was not ok');
            }
            const result = await response.json();
            
            if (result.error) {
                setPredictionError(result.error);
            } else if (result.predictions && result.predictions.length > 0) {
                setPredictionResult({ rawOutput: result.predictions[0] });
                setShowPredictionResults(true);
            } else {
                throw new Error("Received an invalid response format from the server.");
            }
        } catch (err) {
            setPredictionError(`Failed to fetch prediction: ${err.message}.`);
            setShowPredictionResults(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePollenFormChange = (e) => {
        const { name, value } = e.target;
        setPollenFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- MODIFIED POLLEN SUBMIT HANDLER ---
    const handlePollenFormSubmit = async (e) => {
        e.preventDefault();
        setIsPollenLoading(true);
        setPollenError(null);
        setPollenResult(null);

        // Simulate API call with a timeout
        setTimeout(() => {
            // Generate a random prediction: 0 (Low Risk) or 1 (High Risk)
            const randomPrediction = Math.round(Math.random());
            
            setPollenResult({ prediction: randomPrediction });
            setShowPollenResults(true);
            setIsPollenLoading(false);
        }, 1500); // 1.5 second delay to simulate loading
    };

    // --- Main Render Logic ---
    if (currentView === 'choice') {
        return <ChoiceScreen setCurrentView={setCurrentView} />;
    }

    if (currentView === 'agricultural') {
        if (showPredictionResults) {
            return <AgriculturalResults 
                        setShowPredictionResults={setShowPredictionResults}
                        predictionResult={predictionResult}
                        predictionError={predictionError}
                    />;
        } else {
            return <AgriculturalForm
                        setCurrentView={setCurrentView}
                        predictionFormData={predictionFormData}
                        handleAgriculturalFormChange={handleAgriculturalFormChange}
                        handleAgriculturalFormSubmit={handleAgriculturalFormSubmit}
                        isLoading={isLoading}
                    />;
        }
    }

    if (currentView === 'pollen') {
        if (showPollenResults) {
            return <PollenResults
                        setShowPollenResults={setShowPollenResults}
                        pollenResult={pollenResult}
                        pollenError={pollenError}
                    />;
        } else {
            return <PollenForm
                        setCurrentView={setCurrentView}
                        pollenFormData={pollenFormData}
                        handlePollenFormChange={handlePollenFormChange}
                        handlePollenFormSubmit={handlePollenFormSubmit}
                        isPollenLoading={isPollenLoading}
                    />;
        }
    }

    return <div>Something went wrong.</div>;
};

export default HealthPollen;

