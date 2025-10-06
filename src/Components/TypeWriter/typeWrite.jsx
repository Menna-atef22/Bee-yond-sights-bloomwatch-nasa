import { useState, useEffect } from 'react';
import './typeWrite.css'; 

const TypewriterText = ({ text, speed = 100, startDelay = 500, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset state when text changes to allow re-typing for new messages
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(false);

    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay]); // Rerun if the text itself changes

  useEffect(() => {
    if (!isTyping) return;

    // When typing is finished, call the onComplete callback
    if (currentIndex >= text.length) {
      onComplete?.(); // Optional chaining: only call if the function was provided
      return;
    }

    const typingTimer = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(typingTimer);
  }, [currentIndex, isTyping, text, speed, onComplete]);

  return (
    <span className="typewriter-container">
      {displayedText}
      {/* Show cursor only while typing and if text exists */}
      {text && currentIndex < text.length && <span className="typewriter-cursor"></span>}
    </span>
  );
};

export default TypewriterText;