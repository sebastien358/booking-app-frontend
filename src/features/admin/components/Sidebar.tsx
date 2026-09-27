import styles from './Sidebar.module.scss'
import NavLink from "@/app/nav-link/NavLink";

const adminLinks = [
    {name: 'Accueil', path: '/'},
    {name: 'Tous les rendez-vous', path: '/admin/bookings'},
    {name: 'Tous les témoignanges', path: '/admin/testimonials'}
]

export default function Sidebar() {
    return (
        <div className={styles['admin-sidebar']}>
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

            <div className={styles['reset-contact']}>
                <p>
                    Total
                </p>
                <button className={`${styles['btn']} ${styles['btn-reset']}`}>
                    Réinitialiser
                </button>
            </div>
        </div>
    )
}