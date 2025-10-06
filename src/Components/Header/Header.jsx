import { NavLink, useLocation } from "react-router-dom"; // 1. Import useLocation
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // 2. Get the current location object

  useEffect(() => {
    // This logic now runs every time the page/location changes
    const scrollContainer = document.getElementById('main-scroll-container');
    
    // If there's no scroll container on the new page, we just stop.
    if (!scrollContainer) {
      // Also reset the scroll state when moving to a non-scrolling page
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    // The cleanup function is now even more important, as it runs on every navigation
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [location]); // 3. Add location to the dependency array

  const handleScrollToTop = () => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header className={`${styles.headerContainer} ${isScrolled ? styles.headerHidden : ""}`}>
        <NavLink className={styles.headerContaine} to="/">
          <div className={styles.logoContainer}>
            <h1 className={styles.logoName}>Bee-yond Sights</h1>
          </div>
        </NavLink>

        <button
          className={styles.burgerMenu}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
        </button>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink to="/" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/Dashboard" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/Storytelling" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Storytelling
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/Data" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Data Explorer
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/HealthPollen" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Health & Pollen
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      
      <button 
        onClick={handleScrollToTop} 
        className={`${styles.moonIcon} ${isScrolled ? styles.moonIconVisible : ""}`} 
        aria-label="Scroll to top"
      >
        🌙
      </button>
    </>
  );
}

export default Header;