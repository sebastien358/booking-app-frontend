"use client"

import styles from './ServiceDetails.module.scss'
import {ServiceData} from "@/store/admin/serviceAdmin.store";
import {useState} from "react";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useRouter} from "next/navigation";

type ServiceProps = {
    id: string
    currentService: ServiceData | null
    serviceDelete: (id: string) => Promise<void>
    isLoading: boolean
}

export default function serviceDetails({ id, currentService, serviceDelete, isLoading }: ServiceProps) {
    {/* Gestion de la Modal */}

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const onClickOpenModal = () => {
        setActiveModal(true)
    }

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Suppression d'un service */}

    const router = useRouter()

    const onClickDelete = async () => {
        await serviceDelete(id)
        setActiveModal(false)
        router.push('/admin/services')
    }

    return (
        <main>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && currentService ? (
                <section className={styles['contact-container']}>
                <div className={styles['contact-details']}>
                        <h2>name</h2>
                        <div className={styles['message-body']}>
                            <div className={styles['info-row']}>
                                <span className={styles['info-label']}>Catégorie</span>
                                <span className={styles['info-value']}>{currentService.category.name}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <span className={styles['info-label']}>Durée</span>
                                <span className={styles['info-value']}>{currentService.duration} min</span>
                            </div>
                            <div className={`${styles['info-row']} ${styles['price-row']}`}>
                                <span className={styles['info-label']}>Prix</span>
                                <span className={`${styles['info-value']} ${styles['price']}`}>{currentService.price} €</span>
                            </div>
                        </div>
                        <div className={styles['actions']}>
                            <button
                                onClick={() => onClickOpenModal()}
                                className={styles['btn-delete']}>
                                Supprimer
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
                    <p>Aucun rendez-vous pour le moment</p>
                </section>
            )}
        </main>
    )
}