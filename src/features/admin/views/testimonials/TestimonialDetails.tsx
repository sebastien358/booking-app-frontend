'use client'

import styles from './TestimonialDetails.module.scss'
import {TestimonialData} from "@/store/testimonial.store";
import Image from "next/image";
import NoUser from '@/assets/images/no-user.png'
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useState} from "react";
import {useRouter} from "next/navigation";

type TestimonialProps = {
    id: string
    testimonialAdminToggle: (id: string) => Promise<void>
    testimonialDelete: (id: string) => Promise<void>
    currentTestimonial: TestimonialData | null
    isLoading: boolean
}

export default function TestimonialDetails({ id, testimonialAdminToggle, testimonialDelete, currentTestimonial, isLoading }: TestimonialProps) {

    {/* Gestion de la modal de confirmation */}

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Affichage de la date d'un témoignage */}

    const formatedDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    {/* Activer ou désactiver un témoignage */}

    const toggleTestimonial = async () => {
        await testimonialAdminToggle(id)
    }

    {/* Supprimer un témoignage */}

    const router = useRouter()

    const deleteTestimonial = async () => {
        await testimonialDelete(id)
        router.push('/admin/testimonials')
    }

    return (
        <>
            <section className={styles['contact-container']}>
                {isLoading ? (
                    <section className={styles['loading-indicator']}>
                        <p>Chargement...</p>
                    </section>
                ) : !isLoading && currentTestimonial ? (
                    <section>
                        <div className={styles['contact-details']}>
                            <div className={styles['contact-title']}>
                                <div className={styles['title-left']}>
                                    <h2>{currentTestimonial.author}</h2>
                                    <div className={styles['rating']}>
                                        {[1, 2, 3, 4, 5].map((n, index) => (
                                            <span key={index}>{n <= currentTestimonial.rating ? '⭐' : '☆'}</span>
                                        ))}
                                    </div>
                                    <div className={styles['sub']}>
                                        <span className={styles['job']}>
                                            {currentTestimonial.job}
                                        </span>
                                        <span className={styles['date']}>
                                            {formatedDate(currentTestimonial.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {currentTestimonial.picture ? (
                                    <Image src={currentTestimonial?.picture?.filename} className={styles['img-testimonial']} alt="" width={60} height={60} />
                                ) : (
                                    <Image src={NoUser} className={styles['img-not-found']} alt="" width={45} height={45} />
                                )}
                            </div>
                            <div className={styles['message-body']}>
                                <p className={styles['text']}>{currentTestimonial.message}</p>
                            </div>
                            <div className={styles['actions']}>
                                <button
                                    onClick={() => toggleTestimonial()}
                                    className={currentTestimonial.is_published ? styles['btn-active'] : styles['btn-inactive']}
                                >
                                    {currentTestimonial.is_published ? 'Visible' : 'Non-visible'}
                                </button>
                                <button
                                    onClick={() => setActiveModal(true)}
                                    className={`${styles['btn']} ${styles['btn-delete']}`}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>

                        <ModalConfirm
                            activeModal={activeModal}
                            closeModal={closeModal}
                            onClickDelete={deleteTestimonial}
                        />
                    </section>
                ) : (
                    <section className={styles['empty-state']}>
                        <p>Aucun témoignage pour le moment</p>
                    </section>
                )}
            </section>
        </>
    )
}