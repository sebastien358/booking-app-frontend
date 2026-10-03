'use client'

import styles from './ContactList.module.scss'
import {useContactAdminStore} from "@/store/admin/contactAdmin.store";
import {useEffect} from "react";
import InputSearch from "@/components/input-search/InputSearch";
import Link from "next/link";

export default function ContactList() {

    const { contactList, contactSearch, contactLazyLoad, contacts, isLoading, term, hasMore } = useContactAdminStore()

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
            ) : !isLoading && contacts.length > 0 ? (
                <section className={styles['contact-admin']}>
                    <div className={styles['container']}>
                        <InputSearch
                            term={term}
                            search={contactSearch}
                            placeholder='Rechercher un contact...'
                            activeSearch='contact-admin'
                        />
                        <div className={styles['grid-container']}>
                            {contacts?.map((contact) => (
                                <Link
                                    key={contact.id}
                                    href={`/admin/contacts/${contact.id}`}
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
                                    onClick={() => contactLazyLoad()}
                                    className={styles['btn-load']}
                                >
                                    Charger plus
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <InputSearch
                        term={term}
                        search={contactSearch}
                        placeholder='Rechercher un contact...'
                        activeSearch='contact-admin'
                    />
                    <section className={styles['empty-state']}>
                        <p>Aucun contact pour le moment</p>
                    </section>
                </>
            )}
        </main>
    )
}