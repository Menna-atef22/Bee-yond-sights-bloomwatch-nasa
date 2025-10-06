import styles from "./InfoCard.module.css"
import {motion as m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TypewriterText from "../TypeWriter/typeWrite.jsx"

function InfoCard(props){
    return(
        <m.div className={styles.cardContainer}
        whileHover={{y:-10}}
        transition={{duration:0.5}}>
            <h3>{props.title}</h3>
            <p>
                <TypewriterText text={props.data} speed={200} startDelay={1000}></TypewriterText>
            </p>
        </m.div>
    );
}

export default InfoCard