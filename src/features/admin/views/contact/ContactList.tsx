'use client'

import styles from './ContactList.module.scss'
import {useContactAdminStore} from "@/store/admin/contactAdmin.store";
import {useEffect} from "react";
import InputSearch from "@/components/input-search/InputSearch";

export default function ContactList() {

    const { contactList, contacts, isLoading, hasMore } = useContactAdminStore()

    useEffect(() => {
        contactList()
    }, [])

    const formatedDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    return (
        <main>
            {isLoading ? (
                <section  className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : contacts.length === 0 ? (
                <>
                    <InputSearch
                        term={null}
                        search={null}
                        placeholder='Rechercher un contact'
                        activeSearch='admin-contact'
                    />
                    <section className={styles['empty-state']}>
                        <p>Aucun rendez-vous pour le moment</p>
                    </section>
                </>

            ) : (
                <section className={styles['contact-admin']}>
                    <div className={styles['container']}>
                        <InputSearch
                            term={null}
                            search={null}
                            placeholder='Rechercher un contact'
                            activeSearch='admin-contact'
                        />
                        <div className={styles['grid-container']}>
                            {contacts.map((contact) => (
                                <Link
                                    key={contact.id}
                                    href={`/contact/${contact.id}`}
                                    className={styles['grid-item']}
                                >
                                    <h3>{contact.firstname} {contact.lastname}</h3>
                                    <p>email : {contact.email}</p>
                                    <p>message : {contact.message}</p>
                                    <p>Date : {formatedDate(contact.created_at)}</p>
                                    <small className={styles['isRead']}>
                                        {contact.is_read ? "✅ vu" : "❌ non-vu"}
                                    </small>
                                </Link>
                            ))}
                        </div>

                        <div className={styles['load-contact']}>
                            {hasMore && (
                                <button
                                    className={`${styles['btn']} ${styles['btn-load']}`}
                                >
                                    Charger plus
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}