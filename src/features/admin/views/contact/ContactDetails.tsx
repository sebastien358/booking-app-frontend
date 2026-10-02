'use client'

import styles from './ContactDetails.module.scss'
import {ContactData} from "@/store/admin/contactAdmin.store";
import {useState} from "react";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useRouter} from "next/navigation";

type ContactProps = {
    id: string
    currentContact: ContactData | null
    isLoading: boolean
    contactDelete: (id: string) => Promise<void>
}

export default function ContactDetails({ id, currentContact, contactDelete, isLoading}: ContactProps) {
    {/* Gestion état de la modal */}

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Suppression contact */}

    const router = useRouter()

    const onClickDelete = async () => {
        await contactDelete(id)
        router.push('/admin/contacts')
    }

    return (
        <main className={styles['contact-container']}>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && currentContact ? (
                <section>
                    <div className={styles['contact-details']}>
                        <h2>{currentContact.firstname} - {currentContact.lastname}</h2>
                        <div className={styles['meta']}>
                            <div className={styles['contact-email']}>
                                <p>{currentContact.email}</p>
                                <span className={`${styles['status']} ${!currentContact.is_read ? styles['unread'] : ''}`}>
                                    {currentContact.is_read ? "✅ vu" : "❌ non-vu"}
                                </span>
                            </div>
                        </div>
                        <div className={styles['message-body']}>
                            <h3 className={styles['date-title']}></h3>
                            <p>{currentContact.message}</p>
                        </div>
                        <div className={styles['actions']}>
                            <a
                                href={`https://mail.google.com/mail/?view=cm&to=${currentContact.email}`}
                                target="_blank"
                                rel="noopener"
                                className={styles['btn-reply']}
                            >
                                Répondre
                            </a>
                            <button
                                onClick={() => setActiveModal(true)}
                                className={styles['btn-delete']}
                            >
                                Suprimer
                            </button>
                        </div>
                    </div>
                    <ModalConfirm
                        activeModal={activeModal}
                        closeModal={closeModal}
                        onClickDelete={onClickDelete}
                    />
                </section>
            ) : (
                <section className={styles['empty-state']}>
                    <p>Aucun message de contact pour le moment.</p>
                </section>
            )}
        </main>
    )
}