import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from '../../Components/TypeWriter/typeWrite.jsx';
import styles from './chat.module.css';

const qaData = [
    // ... your Q&A data remains the same ...
    {
      q: "What problem does BloomWatch aim to solve?",
      a: "BloomWatch addresses the challenge of monitoring and visualizing global flowering phenology. Blooming events are critical ecological indicators that affect agriculture, public health, biodiversity, and climate resilience. However, current monitoring approaches are fragmented, limiting our ability to:\n\n• Predict agricultural yields\n• Manage pollen-related health risks\n• Understand long-term ecosystem changes"
    },
    {
      q: "What is the solution proposed by BloomWatch?",
      a: "BloomWatch is an interactive Earth observation platform that detects, monitors, and forecasts blooming events from global to local scales. It transforms NASA satellite data into actionable insights for farmers, researchers, health professionals, and policymakers."
    },
    {
      q: "What are the key features of BloomWatch?",
      a: "• Interactive Dashboard & 2D Map → Displays crop types, bloom intensity, and vegetation indices.\n• Phenology Timeline → Tracks bloom phases (before–peak–after) and compares them across years.\n• Predictive Analytics → AI models forecast bloom timing, intensity, and “what-if” scenarios (e.g., rainfall or temperature shifts).\n• Application Modules:\n  - Agriculture → Flowering & harvest monitoring\n  - Health → Allergy & pollen alerts\n  - Climate Resilience → Linking bloom events to extreme weather\n• Storytelling Mode → Transforms complex datasets into accessible narratives for non-experts."
    },
    {
      q: "How was BloomWatch designed and executed during the hackathon?",
      a: "• Day 1 → Problem framing, dataset preprocessing, AI prototype, backend setup, UI wireframes\n• Day 2 → Integration of AI, backend, and frontend → testing → polishing visuals → preparing final pitch"
    },
    {
      q: "What tools and technologies power BloomWatch?",
      a: "• Frontend → React.js, Mapbox GL / Deck.gl, D3\n• Backend → Python (FastAPI/Flask), PostGIS, Docker\n• AI/Data → TensorFlow, Scikit-learn, Google Earth Engine API\n• Collaboration → GitHub, Slack/Discord, Trello/Notion"
    },
    {
      q: "What NASA datasets are integrated into BloomWatch?",
      a: "• MODIS Vegetation Indices (NDVI/EVI)\n• Landsat 8 & 9 Surface Reflectance\n• VIIRS (Visible Infrared Imaging Radiometer Suite)\n• PACE (Plankton, Aerosol, Cloud, ocean Ecosystem mission)\n• AVIRIS (Airborne Visible/Infrared Imaging Spectrometer)\n• EMIT (Earth Surface Mineral Dust Source Investigation)\n• NASA POWER / ERA5 Climate Data (temperature, precipitation)"
    },
    {
      q: "What other data sources and partners does BloomWatch use?",
      a: "• Copernicus Sentinel-2 Imagery (ESA)\n• Global Land Cover Data\n• USA National Phenology Network\n• iNaturalist (Citizen Science)\n• Agronomic & phenological reports\n\n(All datasets are open-access or permission-confirmed.)"
    }
];

const TYPING_SPEED = 20;
const START_DELAY = 100;
const PAUSE_DURATION = 500; // Pause between messages

function ChatModal({ isOpen, onClose }) {
  // Index of the message currently being typed or just finished
  const [activeMessageIndex, setActiveMessageIndex] = useState(-1);
  const chatContainerRef = useRef(null);
  const timeoutId = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessageIndex]);

  // Effect to manage the sequence
  useEffect(() => {
    if (isOpen) {
      // Start the sequence with the first message (index 0)
      setActiveMessageIndex(0);
    } else {
      // Reset when closed
      setActiveMessageIndex(-1);
    }
    // Clear any pending timeout when opening/closing
    return () => clearTimeout(timeoutId.current);
  }, [isOpen]);

  // This function is called by TypewriterText when it finishes
  const handleTypingComplete = () => {
    timeoutId.current = setTimeout(() => {
      // Move to the next message if there is one
      setActiveMessageIndex(prevIndex => {
        if (prevIndex < qaData.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex; // Stay on the last index
      });
    }, PAUSE_DURATION);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {/* Render only the messages up to the active one */}
          {qaData.slice(0, activeMessageIndex + 1).map((item, index) => (
            <div key={index} className={styles.qaBlock}>
              <p className={styles.question}>{item.q}</p>
              <div className={styles.answerBlock}>
                <div className={styles.answer}>
                  {/* If this is the currently active message, type it out */}
                  {index === activeMessageIndex ? (
                    <TypewriterText
                      text={item.a}
                      speed={TYPING_SPEED}
                      startDelay={START_DELAY}
                      onComplete={handleTypingComplete} // Pass the callback
                    />
                  ) : (
                    // If this message is already finished, display it instantly
                    item.a
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;