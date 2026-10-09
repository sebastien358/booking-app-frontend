"use client";

import styles from './Footer.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faFacebook, faSquareTwitter} from '@fortawesome/free-brands-svg-icons';
import {useBookingModalStore} from "@/store/bookingModal.store";
import {useState} from "react";
import LegalNotice from "@/components/legal-notice/LegalNotice";

export default function Footer() {

    const { openModalBooking } = useBookingModalStore()

    const [openModalLegal, setOpenModalLegal] = useState<boolean>(false)

    const closeModalLegal = () => {
        setOpenModalLegal(false)
    }

    return (
        <footer className={styles['footer']}>
            <div className={styles['footer__container']}>
                {/* COLONNE 1 */}
                <div className={styles['footer__col']}>
                    <div className={styles['footer__logo__wrapper']}>
                        <div className={styles['logo']}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={styles['footer__brand']}>
                                Cabinet Bien-Être
                            </h3>
                            <p className={styles['footer__subtitle']}>
                                Consultations sur rendez-vous
                            </p>
                        </div>
                    </div>
                    <p className={styles['footer__desc']}>
                        Un espace dédié à votre bien-être et à votre sérénité.
                    </p>
                    <div className={styles['footer__socials']}>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faSquareTwitter} />
                        </a>
                    </div>
                </div>
                {/* COLONNE 2 */}
                <div className={styles['footer__col']}>
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-map-marker-alt"></i>
                        <div className="d-flex flex-column ml-5">
                            <h4 className={styles['footer__col__title']}>
                                18 rue de la Sérénité<br />
                                75008 Paris
                            </h4>
                        </div>
                    </div>
                    <p>📞 01 42 56 78 90</p>
                    <span>✉️ contact@salon-bien-etre.fr</span>
                </div>
                {/* COLONNE 3 */}
                <div className={styles['footer__col']}>
                    <div className={styles['footer__col__hour']}>
                        <h4 className={styles['footer__col__title']}>
                            🕒 Horaires
                        </h4>
                    </div>
                    <ul>
                        <li>Lun - Vendredi : 9h - 18h</li>
                        <li>Sam: sur rendez-vous</li>
                        <li>Dimanche : fermé</li>
                    </ul>
                    <div className={styles['footer__badge']}>
                        <div className="d-flex align-items-center">
                            <span className={styles['point']}></span>
                            <span className={styles['dot']}>Ouvert maintenant</span>
                        </div>
                        <small>Ferme à 18h aujourd’hui</small>
                    </div>
                </div>
                {/* COLONNE 4 */}
                <div className={styles['footer__col']}>
                    <h4 className={styles['footer__col__title']}>
                        Services
                    </h4>
                    <ul>
                        <li>Accompagnement bien-être</li>
                        <li>Stress & émotions</li>
                        <li>Développement personnel</li>
                        <li>Consultations personnalisées</li>
                    </ul>
                    <button
                        onClick={() => openModalBooking()}
                        className={styles['footer__cta']}>
                        Prendre rendez-vous
                    </button>
                </div>
            </div>
            <div className={styles['footer__bottom']}>
                <p>© 2026 Cabinet Bien-Être. Tous droits réservés.</p>
                <p onClick={() => setOpenModalLegal(true)} className={styles['legal-notices']}>
                    Mentions légales — Politique de confidentialité — CGV
                </p>
            </div>

            <LegalNotice
                openModalLegal={openModalLegal}
                closeModalLegal={closeModalLegal}
            />
        </footer>
    )
}