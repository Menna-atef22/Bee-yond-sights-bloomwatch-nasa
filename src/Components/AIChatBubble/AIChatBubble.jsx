import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './AIChatBubble.module.css';
import AIIcon from './bot.avif'; // Make sure this path is correct

function AIChatBubble() {
  // Renamed state for clarity
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null); // Ref to detect clicks outside the component

  // Feature links remain the same
  const featureLinks = [
    { text: "See from Space", path: "/Dashboard" },
    { text: "Understand the Data", path: "/DataExplorer" },
    { text: "Stay Safe (Health & Pollen)", path: "/HealthPollen" },
    { text: "Link to Climate (Desert Risk)", path: "/DesertRisk" },
  ];

  // --- NEW: LOGIC TO HANDLE CLICKS OUTSIDE THE COMPONENT ---
  useEffect(() => {
    // Only add listener if the bubble is open
    if (!isOpen) return;

    function handleClickOutside(event) {
      // If the click is outside the referenced component, close it
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Rerun this effect when `isOpen` changes

  // Toggles the chat bubble open/closed
  const handleIconClick = (e) => {
    e.stopPropagation(); // Prevents the click from being caught by the 'outside' listener
    setIsOpen(prev => !prev);
  };

  return (
    <div
      className={styles.aiChatContainer}
      ref={chatRef}
    >
      {/* The chat bubble that appears on click */}
      <div className={`${styles.chatBubble} ${isOpen ? styles.chatBubbleVisible : ''}`}>
        <p className={styles.chatMessage}>Hello sir, meet our models!</p>
        <div className={styles.chatLinks}>
          {featureLinks.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className={styles.chatLink}
              onClick={() => setIsOpen(false)} // Close when a link is clicked
            >
              {feature.text}
            </Link>
          ))}
        </div>
      </div>

      {/* The AI icon */}
      <div className={styles.aiIcon} onClick={handleIconClick}>
        <img src={AIIcon} alt="AI Assistant" />
      </div>
    </div>
  );
}

export default AIChatBubble;