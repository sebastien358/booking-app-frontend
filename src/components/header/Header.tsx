"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import styles from './Header.module.scss'
import NavLink from "@/app/nav-link/NavLink";
import {useAuthStore} from "@/store/auth.store";
import {useBookingModalStore} from "@/store/bookingModal.store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

export default function Header({ bookingOpen }: { bookingOpen: () => void }) {

    const { token, isAdmin, isUser, logout } = useAuthStore()

    {/* Menu Administration */}

    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsVisible(true)
    }

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, 150)
    }

    const pathname = usePathname();

    const closeMenu = () => setIsVisible(false);

    const [activeSection, setActiveSection] = useState<string>('')

    useEffect(() => {
        const sections = ['about', 'services', 'testimonial']

        const handleScroll = () => {
            const scrollPos = window.scrollY + 120

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

    {/* STORE MODAL BOOKING */}

    const { openModalBooking } = useBookingModalStore()

    {/* Menu Mobile */ }

    const [openMobile, setOpenMobile] = useState<boolean>(false)

    const toggleMobile = () => {
        setOpenMobile(!openMobile)
    }

    let byPrefixAndName;
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
                    <Link href="/#services" className={isActive('/#services') ? styles['active'] : ''}>
                        Services
                    </Link>
                    <Link href="/#testimonials" className={isActive('/#testimonial') ? styles['active'] : ''}>
                        Témoignages
                    </Link>
                    <NavLink href="/contact" dropdown>
                        Contact
                    </NavLink>

                    <div className={styles['header__actions']} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                        <FontAwesomeIcon icon={faUser} className={token ? styles['active-login'] : ''} />
                        <>
                            {!token ? (
                                <div className={`${styles['header__actions__menu']} ${isVisible ? styles['header__actions__menu__open'] : ''}`}>
                                    <NavLink href="/login" dropdown>
                                        Connexion
                                    </NavLink>
                                    <NavLink href="/register" dropdown>
                                        Inscription
                                    </NavLink>
                                </div>
                            ) : token && isAdmin() ? (
                                <div className={`${styles['header__actions__menu']} ${isVisible ? styles['header__actions__menu__open'] : ''}`}>
                                    <NavLink href="/admin/bookings" dropdown>
                                        Espace admin
                                    </NavLink>
                                    <Link onClick={() => logout()} href="/login">
                                        Déconnexion
                                    </Link>
                                </div>
                            ) : token && isUser() && !isAdmin() && (
                                <div className={`${styles['header__actions__menu']} ${isVisible ? styles['header__actions__menu__open'] : ''}`}>
                                    <p>User</p>
                                    <Link onClick={() => logout()} className={styles['logout']} href="/login">
                                        Déconnexion
                                    </Link>
                                </div>
                            )}
                       </>
                    </div>
                </nav>

                {/* CTA */}
                <div>
                    <button onClick={() => openModalBooking()} className={styles['header__cta']}>
                        Prendre RDV
                    </button>
                </div>

                {/* BURGER (mobile) */}
                <button onClick={() => toggleMobile()} className={styles['header__burger']}>
                    <FontAwesomeIcon icon={['fas', 'bars']} />
                </button>
            </div>

            {/* MENU MOBILE */}

            <div className={`${styles['mobile-menu']} ${openMobile ? styles['mobile-menu__open'] : ''}`}>
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
        </header>
    )
}