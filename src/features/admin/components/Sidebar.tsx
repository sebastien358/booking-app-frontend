'use client'

import styles from './Sidebar.module.scss'
import NavLink from "@/app/nav-link/NavLink";
import {usePathname} from "next/navigation";
import {useBookingAdminStore} from "@/store/admin/bookingAdmin.store";
import {useTestimonialAdminStore} from "@/store/admin/testimonialAdmin.store";
import {useContactAdminStore} from "@/store/admin/contactAdmin.store";
import {useServiceAdminStore} from "@/store/admin/serviceAdmin.store";

const adminLinks = [
    {name: 'Accueil', path: '/'},
    {name: 'Tous les rendez-vous', path: '/admin/bookings'},
    {name: 'Tous les témoignanges', path: '/admin/testimonials'},
    {name: 'Tous les messages', path: '/admin/contacts'},
    {name: 'Tous les services', path: '/admin/services' },
    {name: 'Ajouter un service', path: '/admin/services/add' }
]

export default function Sidebar() {

    const { countBookings, resetBooking } = useBookingAdminStore()
    const { countTestimonials, resetTestimonial } = useTestimonialAdminStore()
    const { countContacts, resetContact } = useContactAdminStore()
    const { countServices, resetService } = useServiceAdminStore()

    const pathname = usePathname()

    const adminPageConfig = {
        '/admin/bookings': { count: countBookings, reset: resetBooking },
        '/admin/testimonials': { count: countTestimonials, reset: resetTestimonial },
        '/admin/contacts': { count: countContacts, reset: resetContact },
        '/admin/services': { count: countServices, reset: resetService }
    }

    const current = adminPageConfig[pathname]
    const countEl = current?.count ?? 0

    const resetDataStore = () => {
        current?.reset()
    }

    return (
        <main className={styles['admin-sidebar']}>
            <div className={styles['admin-sidebar__container']}>
                <h2>Admin</h2>
                <div className={styles['admin-sidebar__container__nav']}>
                    {adminLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            href={link.path}
                            dropdownSidebar
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>

            {current && (
                <div className={styles['reset-contact']}>
                    <p>Total : {countEl}</p>
                    <button onClick={() => resetDataStore()} className={`${styles['btn']} ${styles['btn-reset']}`}>
                        Réinitialiser
                    </button>
                </div>
            )}
        </main>
    )
}