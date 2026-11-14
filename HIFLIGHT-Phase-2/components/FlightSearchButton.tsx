import styles from './FlightSearchButton.module.css';

export default function FlightSearchButton({launching}:{launching:boolean}) {
 return <button className={`search-button ${styles.button} ${launching?styles.launching:''}`} type="submit" disabled={launching} aria-busy={launching}>
  <span className={styles.label}>{launching?'Recherche…':'Rechercher'}</span>
  <span className={styles.scene} aria-hidden="true">
   <span className={styles.runway}><i/><i/><i/><i/></span>
   <svg className={styles.plane} viewBox="0 0 100 38" aria-hidden="true">
    <path d="M9 24 3 5h6l16 19h48c9 0 18 3 23 7 2 2 1 3-2 3H25c-8 0-15-3-21-8Z" fill="currentColor"/>
    <path d="m43 26-13-20h7l25 20Z" fill="currentColor"/>
    <path d="m43 31-13 7h10l23-7Z" fill="currentColor"/>
    <path d="m79 27 8 3h-8l-3-3Z" fill="#07152d"/>
    <path d="M28 28h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2" stroke="#07152d" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 25h9M25 32h51" stroke="#ffb3ac" strokeWidth=".8" strokeLinecap="round"/>
    <path d="M50 33h10v3H49Z" fill="#ff8c82"/>
   </svg>
  </span>
 </button>;
}
