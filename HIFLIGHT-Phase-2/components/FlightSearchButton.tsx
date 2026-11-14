import styles from './FlightSearchButton.module.css';

export default function FlightSearchButton({launching}:{launching:boolean}) {
 return <button className={`search-button ${styles.button} ${launching?styles.launching:''}`} type="submit" disabled={launching} aria-busy={launching}>
  <span className={styles.label}>{launching?'Recherche…':'Rechercher'}</span>
  <span className={styles.scene} aria-hidden="true">
   <span className={styles.runway}><i/><i/><i/><i/></span>
   <svg className={styles.plane} viewBox="0 0 64 32" aria-hidden="true">
    <path d="M5 20 2 8h4l10 11h32c6 0 11 3 13 5 1 1 0 2-2 2H15c-5 0-9-2-12-5Z" fill="currentColor"/>
    <path d="m29 22-9-15h5l17 15M25 25l-8 5h6l15-5" fill="currentColor"/>
    <path d="m50 21 4 2h-6v-2Z" fill="#07152d"/>
    <path d="M20 22h2m4 0h2m4 0h2m4 0h2" stroke="#07152d" strokeWidth="1.2" strokeLinecap="round"/>
   </svg>
  </span>
 </button>;
}
