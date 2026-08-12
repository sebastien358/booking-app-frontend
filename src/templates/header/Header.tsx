"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Header.module.scss'
import path from "node:path";

export default function Header({ bookingOpen }: { bookingOpen: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const serviceMenu = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const toggleMenu = () => setIsVisible(!isVisible);
    const closeMenu = () => setIsVisible(false);

    // 1. Au clic on met à jour le hash actif
    // 2. Au load on check si y'a déjà un # dans l'url


    const [activeSection, setActiveSection] = useState<string>('')

    useEffect(() => {
        const sections = ['about', 'services', 'testimonials']

        const handleScroll = () => {
            const scrollPos = window.scrollY + 200

            let current = ''
            sections.forEach((id) => {
                const el = document.getElementById(id)
                if (el && el.offsetTop <= scrollPos) {
                    current = id
                }
            })
            setActiveSection(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    const isActive = (path: string) => {
        if (path === '/') return pathname === '/' && !activeSection
        const hash = path.split('#')[1]
        return hash === activeSection
    }

    return (
        <header className={styles['header']}>
            <div className={styles['header__container']}>
                {/* LOGO */}
                <div className={styles['header__brand']}>
                    <div className={styles['header__logo']}>
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <div className="d-flex flex-column">
                        <p>Cabinet Bien-Être</p>
                        <span>Consultations sur rendez-vous</span>
                    </div>
                </div>

                {/* NAV DESKTOP */}
                <nav className={styles['header__nav']}>
                    <Link href="/" className={isActive('/') ? styles['active'] : ''}>
                        Accueil
                    </Link>
                    <Link href="/#about" className={isActive('/#about') ? styles['active'] : ''}>
                        À propos
                    </Link>
                    <Link href="/#services" className={styles['']}>
                        Services
                    </Link>
                    <Link href="/#testimonials" className={styles['']}>
                        Témoignages
                    </Link>
                    <Link href="/contact/form" className={isActive('/contact/form') ? styles['active'] : ''}>
                        Contact
                    </Link>

                    <div className={styles['header__actions']}>
                        <FontAwesomeIcon
                            icon="fa-solid fa-user"
                            onClick={toggleMenu}
                            style={{cursor: 'pointer'}}
                        />
                        {isVisible && (
                            <div className={styles['header__actions__menu']} ref={serviceMenu}>
                                <Link href="/login" className={isActive('/login') ? styles['active'] : ''}>
                                    Connexion
                                </Link>
                                <Link href="/register" className={isActive('/register') ? styles['active'] : ''}>
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* CTA */}
                <div>
                    <button onClick={bookingOpen} className={styles['header__cta']}>
                        Prendre RDV
                    </button>
                </div>

                {/* BURGER (mobile) */}
                <button className={styles['header__burger']} onClick={toggleMenu}>
                    <span></span><span></span><span></span>
                </button>
            </div>

            {/* MENU MOBILE */}
            {isVisible && (
                <div className={styles['mobile-menu']} ref={serviceMenu}>
                    <Link href="/" onClick={closeMenu} className={isActive('/') ? styles['active'] : ''}>
                        Accueil
                    </Link>
                    <Link href="/#about" onClick={closeMenu}>À propos</Link>
                    <Link href="/#services" onClick={closeMenu}>Services</Link>
                    <Link href="/#testimonials" onClick={closeMenu}>Témoignages</Link>
                    <Link href="/contact/form" onClick={closeMenu} className={isActive('/contact/form') ? styles['active'] : ''}>
                        Contact
                    </Link>
                    <div>
                        <Link href="/login" onClick={closeMenu} className={isActive('/login') ? styles['active'] : ''}>
                            Connexion
                        </Link>
                    </div>
                    <button onClick={bookingOpen} className={styles['mobile-cta']}>
                        Prendre RDV
                    </button>
                </div>
            )}
        </header>
    );
}