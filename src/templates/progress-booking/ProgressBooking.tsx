import styles from './ProgressBooking.module.scss'

export default function ProgressBooking({progressStep}: {progressStep: number}) {
    return (
        <section className={styles['booking-progress']}>
            <div className={`${styles['separator-progress-left']} ${progressStep >= 1 ? styles['active'] : ''}`}></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={progressStep >= 1 ? styles['active'] : ''}>
                <rect x="3" y="4" width="18" height="4" rx="2" fill="#ffffff"/>
                <rect x="3" y="10" width="12" height="4" rx="2" fill="#ffffff"/>
                <rect x="3" y="16" width="8" height="4" rx="2" fill="#ffffff"/>
            </svg>
            <div className={`${styles['separator-progress']} ${progressStep >= 2 ? styles['active'] : ''}`}></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={progressStep >= 2 ? styles['active'] : ''}>
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#ffffff" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="#ffffff" strokeWidth="2"/>
                <rect x="7" y="12" width="4" height="4" rx="1" fill="#ffffff"/>
            </svg>
            <div className={`${styles['separator-progress']} ${progressStep >= 3 ? styles['active'] : ''}`}></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={progressStep >= 3 ? styles['active'] : ''}>
                <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2"/>
                <path d="M7 12l3 3 7-7" stroke="#ffffff" strokeWidth="2" fill="none"/>
            </svg>
            <div className={styles['separator-progress-right']}></div>
        </section>
    )
}