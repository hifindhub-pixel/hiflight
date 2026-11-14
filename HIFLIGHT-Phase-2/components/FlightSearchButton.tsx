import styles from './FlightSearchButton.module.css';

export default function FlightSearchButton({launching}:{launching:boolean}) {
 return <button className={`search-button ${styles.button} ${launching?styles.launching:''}`} type="submit" disabled={launching} aria-busy={launching}>
  <span className={styles.label}>{launching?'Recherche…':'Rechercher'}</span>
  <span className={styles.scene} aria-hidden="true">
   <span className={styles.runway}><i/><i/><i/><i/></span>
   <svg className={styles.plane} viewBox="0 0 32 32" fill="currentColor"><path d="M28 14.5c1.7 0 2.5.7 2.5 1.5s-.8 1.5-2.5 1.5h-8l-8 11H9l4-11H6l-3 4H1l2-5.5L1 10.5h2l3 4h7l-4-11h3l8 11Z"/></svg>
  </span>
 </button>;
}
