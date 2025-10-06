import { motion as m } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Landing({ className, children }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false, // true = only animate once
  });

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0.2}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </m.div>
  );
}

export default Landing;
