import { useState } from "react";
import { motion as m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./Card.module.css";

function Card(props){
    const [isHovered, setIsHovered] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    const getHoverAnimation = () => {
        switch(props.featureType) {
            case 'satellite':
                return { scale: isHovered ? 1.15 : 1 };
            case 'analytics':
                return { scale: isHovered ? 1.05 : 1, rotateY: isHovered ? 5 : 0 };
            case 'health':
                return { scale: isHovered ? 1.08 : 1, rotateZ: isHovered ? 2 : 0 };
            case 'climate':
                return { scale: isHovered ? 1.1 : 1 };
            case 'storytelling':
                return { scale: isHovered ? 1.12 : 1, rotateX: isHovered ? 3 : 0 };
            default:
                return { scale: isHovered ? 1.1 : 1 };
        }
    };

    return(
        <m.div
            ref={ref}
            className={`${styles.cardContainer} ${styles[props.featureType] || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{ duration: 0.6, delay: props.delay || 0 }}
            whileHover={{ y: -10 }}
        >
            <div className={styles.cardImageContainer}>
                <m.img
                    className={styles.cardImage}
                    src={props.src}
                    alt={props.title}
                    animate={getHoverAnimation()}
                    transition={{ duration: 0.4 }}
                />
                <div className={styles.imageOverlay}></div>
                {props.featureType === 'health' && (
                    <m.div
                        className={styles.pulseIcon}
                        animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                    />
                )}
            </div>

            <div className={styles.cardText}>
                <h3>{props.title}</h3>
                <p>{props.description.length>200?(props.description.slice(0,200)+"..."):props.description}</p>
                <m.button
                    className={styles.learnMoreBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Learn More
                    <span className={styles.arrow}>→</span>
                </m.button>
            </div>

            <div className={styles.cardGlow}></div>
        </m.div>
    );
}

export default Card
