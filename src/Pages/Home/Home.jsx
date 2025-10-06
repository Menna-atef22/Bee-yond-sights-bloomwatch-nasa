import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import Landing from "../../Components/Landing/Landing.jsx";
import TypewriterText from "../../Components/TypeWriter/typeWrite.jsx";
import ChatModal from "../../Components/chatModel/chat.jsx";

import styles from "./Home.module.css";

function Home() {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      icon: "🛰️",
      title: "See from Space",
      description: "Interactive bloom maps powered by NASA & ESA satellites.",
    },
    {
      icon: "📊",
      title: "Understand the Data",
      description: "Charts & insights about bloom patterns, intensity, and coverage.",
    },
    {
      icon: "🌸",
      title: "Stay Safe",
      description: "Allergy and pollen forecasts with health recommendations.",
    },
    {
      icon: "🌍",
      title: "Link to Climate",
      description: "Discover how blooms connect to climate shifts and disasters.",
    },
  ];

  return (
    <div id="main-scroll-container" className={styles.landingWrapper}>
      {/* --- Landing 1: Hero Section --- */}
      <Landing className={styles.homeLanding}>
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          Bee-yond Sights
        </motion.h2>
        <p>
          <TypewriterText
            text="BloomWatch: Connecting Earth, Air & Life"
            speed={80}
            startDelay={1500}
          />
        </p>
      </Landing>

      {/* --- Landing 2: Problem & Mission Section --- */}
      <Landing className={styles.problemLanding}>
        <motion.div
          className={styles.problemContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2 className={styles.problemTitle} variants={itemVariants}>
            Problem & Mission
          </motion.h2>

          <motion.button
            className={styles.qaButton}
            onClick={() => setIsModalOpen(true)}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read the Q&A
          </motion.button>
          
          <motion.p className={styles.problemSubtitle} variants={itemVariants}>
            See how NASA satellites capture the birth of a bloom, and follow it as it transforms landscapes.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link to="/Storytelling" className={styles.storyCtaBtn}>
              Explore the Full Story
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </Landing>

      {/* --- Landing 3: Features Section --- */}
      <Landing className={styles.featuresLanding}>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={itemVariants}
        >
          What You Can Do with Bloom-Watch
        </motion.h2>
        <motion.p
          className={styles.featuresSubtitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={itemVariants}
        >
          Explore blooms, track changes, and understand their impact — all in one place.
        </motion.p>
        
        {/* --- THIS IS THE SOLAR SYSTEM FOR DESKTOP VIEW --- */}
        <motion.div
          className={styles.solarSystem}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className={styles.sun}></div>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles.orbit} ${styles[`orbit${index + 1}`]} ${
                hoveredPlanet === index ? styles.paused : ""
              }`}
            >
              <div
                className={`${styles.planet} ${styles[`planet${index + 1}`]}`}
                onMouseEnter={() => setHoveredPlanet(index)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div className={styles.planetContent}>{feature.icon}</div>
                <div className={styles.planetInfo}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* --- THIS IS THE NEW TABLE FOR MOBILE VIEW --- */}
        <div className={styles.featuresTableContainer}>
          <table className={styles.featuresTable}>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className={styles.iconCell}>{feature.icon}</td>
                  <td>
                    <strong className={styles.titleCell}>{feature.title}</strong>
                    <p className={styles.descriptionCell}>{feature.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Landing>
      
      <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Home;