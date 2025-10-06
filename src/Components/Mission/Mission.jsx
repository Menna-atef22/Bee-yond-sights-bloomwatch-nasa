import { motion as m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./Mission.module.css";

function Mission() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  return (
    <m.div
      ref={ref}
      className={styles.missionContainer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0.2, y: inView ? 0 : 50 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.missionContent}>
        <div className={styles.missionLeft}>
          <h2 className={styles.missionTitle}>Mission & Why It Matters</h2>
          <div className={styles.missionText}>
            <p className={styles.missionStatement}>
              At BloomWatch, we believe that understanding our environment is the first step
              toward protecting it. Our mission is to bridge the gap between complex environmental
              data and everyday decision-making.
            </p>
            <div className={styles.valuesList}>
              <div className={styles.valueItem}>
                <h3>Accessibility</h3>
                <p>Making environmental data understandable and actionable for everyone</p>
              </div>
              <div className={styles.valueItem}>
                <h3>Innovation</h3>
                <p>Using cutting-edge technology to monitor and predict environmental changes</p>
              </div>
              <div className={styles.valueItem}>
                <h3>Impact</h3>
                <p>Empowering communities to make informed decisions about their environment</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.missionRight}>
          <div className={styles.visualsContainer}>
            <div className={styles.visualGrid}>
              <div className={styles.visualItem}>
                <img src="../../assets/worldmap.png" alt="Global Environmental Monitoring" className={styles.visualImage} />
                <span>Global Coverage</span>
              </div>
              <div className={styles.visualItem}>
                <img src="../../assets/flower.png" alt="Nature & Biodiversity" className={styles.visualImage} />
                <span>Biodiversity</span>
              </div>
              <div className={styles.visualItem}>
                <img src="../../assets/bg.jpg" alt="Environmental Data" className={styles.visualImage} />
                <span>Real-time Data</span>
              </div>
              <div className={styles.visualItem}>
                <img src="../../assets/react.svg" alt="Technology Innovation" className={styles.visualImage} />
                <span>Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default Mission;
