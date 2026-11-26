import { useId } from 'react';
import styles from './FlightSearchButton.module.css';

export default function FlightSearchButton({ launching }: { launching: boolean }) {
  const bodyGradient = `aircraft-${useId().replace(/:/g, '')}`;
  return (
    <button className={`search-button ${styles.button} ${launching ? styles.launching : ''}`} type="submit" disabled={launching} aria-busy={launching}>
      <span className={styles.label}>{launching ? 'Recherche…' : 'Rechercher'}</span>
      <span className={styles.scene} aria-hidden="true">
        <span className={styles.runway}><i /><i /><i /><i /><i /></span>
        <span className={styles.shadow} />
        <svg className={styles.plane} viewBox="0 0 144 48" aria-hidden="true">
          <defs>
            <linearGradient id={bodyGradient} x1="0" y1="20" x2="0" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffaea1" />
              <stop offset=".4" stopColor="#ff7771" />
              <stop offset="1" stopColor="#ee535e" />
            </linearGradient>
          </defs>
          <path d="M20 27 10 5Q10 4 12 4h5l24 24Z" fill="#ff6b6b" />
          <path d="m67 26-9-14h6l24 15Z" fill="#df4f5b" />
          <path d="M8 26 26 24h84c9 0 13 2 18 6l10 4q3 2-1 3l-16 2H39c-10 0-19-3-27-7l-7-4q-2-2 3-2Z" fill={`url(#${bodyGradient})`} />
          <path d="M32 25h76c8 0 12 1 16 4" fill="none" stroke="#ffd2bf" strokeWidth="1.2" strokeLinecap="round" />
          <path d="m115 27 6 1 6 5h-10Z" fill="#142239" />
          <path d="M110 27h3l2 6h-5Z" fill="#142239" />
          <path d="M39 29h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2m5 0h2" stroke="#142239" strokeWidth="2" strokeLinecap="round" />
          <path d="m18 29-10 7h7l19-6Z" fill="#ff9c92" />
          <path d="m73 32-18 13h9l31-12Z" fill="#ffb4a5" />
          <path d="m61 43 27-10" fill="none" stroke="#fff0de" strokeOpacity=".55" strokeWidth=".8" />
          <path d="M85 37h12q5 0 5 3t-5 3H84q-3 0-3-2t4-4Z" fill="#f16a70" />
          <ellipse cx="99" cy="40" rx="2.2" ry="2.6" fill="#132137" />
          <path d="M85 38h10" stroke="#ffc4b2" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}
