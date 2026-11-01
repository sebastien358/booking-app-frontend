"use client"

import styles from './AccountClients.module.scss'
import {useAccountAdminStore} from "@/store/admin/accountAdmin.store";
import {useEffect, useState} from "react";
import {useAuthStore} from "@/store/auth.store";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";

export default function AccountClients() {

    {/*
        Store UseAuthStore
        Récupération de l'id de l'utilisateur connecté
    */}

    const { infoMe, userId } = useAuthStore()

    useEffect(() => {
        infoMe()
    }, [infoMe]);

    {/*  Store Récupérations de la liste des clients */}

    const { clientsList, clientIsRead, clientDelete, setClientId, users, isLoading } = useAccountAdminStore()

    useEffect(() => {
        clientsList()
    }, [clientsList]);

    console.log(users)

    const displayDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    {/*  Marquer comme visible ou invisible un client : (isVisible) */}

    const onClickClientIsVisible = (id: number) => {}

    {/*  Marquer comme vu un client : (isRead) */}

    const onClickClientIsRead = async (id: number) => {
        await clientIsRead(id)
    }

    {/*  Gestion Modal de suppreession d'un client */}

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const onClickOpenModal = (id: number) => {
        setActiveModal(true)
        setClientId(id)
    }

    const closeModal = () => {
        setActiveModal(false)
    }

    {/*  Suppression d'un client */}

    const onClickDelete = async () => {
        await clientDelete()
        setActiveModal(false)
    }

    return (
        <main>
            {isLoading ? (
                <section className={styles['spinner']}>
                    <span className={styles['spinner__loader']}></span>
                </section>
            ) : !isLoading && users.length > 0 ? (
                <section className={styles['page']}>
                    {/* Input Search */}
                    <div className={styles['input-search']}>

                    </div>

                    {/* Clients */}
                    <div className={styles['client-list']}>
                        <div className={styles['table-wrapper']}>
                            <table className={styles['table']}> {/* <-- ICI IL MANQUAIT */}
                                <thead>
                                <tr>
                                    <th className={styles['col-id']}>#</th>
                                    <th className={styles['col-email']}>Email</th>

                                    <th className={styles['col-date']}>Inscrit le</th>
                                    <th className={styles['col-visible']}>Visible</th>
                                    <th className={styles['col-visible']}>Vu</th>
                                    <th className={styles['col-action']}></th>
                                </tr>
                                </thead>
                                <tbody>
                                {!users.length ? (
                                    <tr>
                                        <td colSpan={7} className={styles['empty']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            Aucun client trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((c: any) => (
                                        <tr className={styles['client-row']} key={c.id}>
                                            <td className={`${styles['col-id']} ${styles['text-muted']}`}>{c.id}</td>
                                            <td className={styles['col-email']}>
                                                <span className={styles['label']}>Email</span>
                                                <span>{c.email}</span>
                                            </td>
                                            <td className={`${styles['col-date']} ${styles['text-muted']}`}>
                                                <span className={styles['label']}>Inscrit le</span>
                                                <span className={styles['created-at']}>08/1985</span>
                                            </td>
                                            <td className={styles['col-visible']} onClick={(e) => e.stopPropagation()}>
                                                <span className={styles['label']}>Visible</span>
                                                <label className={styles['toggle']}>
                                                    <input
                                                        type="checkbox"
                                                        checked={c.isVisible}
                                                        disabled={c.id === userId}
                                                        onClick={() => onClickClientIsVisible(c.id)}
                                                    />
                                                    <span className={styles['slider']}></span>
                                                </label>
                                            </td>
                                            <td className={`${styles['col-date']} ${styles['text-muted']}`}>
                                                <span className={styles['label']}>Vu</span>
                                                <label className={styles['toggle']}>
                                                    <input
                                                        type="checkbox"
                                                        checked={c.isRead}
                                                        disabled={c.id === userId}
                                                        onClick={() => onClickClientIsRead(c.id)}
                                                    />
                                                    <span className={styles['slider']}></span>
                                                </label>
                                            </td>
                                            <td className={styles['col-action']}>
                                                <button
                                                    className={`${styles['action-btn']} ${styles['delete-btn']}`}
                                                    disabled={c.id === userId}
                                                    onClick={() => onClickOpenModal(c.id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <ModalConfirm
                        activeModal={activeModal}
                        closeModal={closeModal}
                        onClickDelete={onClickDelete}
                    />

                </section>
            ) : (
                <div className={styles['no-client']}>
                    <p>Aucun client pour le moment.</p>
                </div>
            )}
        </main>
    )
}