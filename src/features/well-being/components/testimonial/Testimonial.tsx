'use client'

import styles from './Testimonial.module.scss'
import ModalTestimonial from "@/components/modal-testimonial/ModalTestimonial";
import {useEffect, useState} from "react";
import {useTestimonialStore} from "@/store/testimonial.store";
import NoImage from '@/assets/images/téléchargement.svg'
import Image from "next/image";

export default function Testimonial() {

    {/* Store Testimonial */}

    const { testimonialList, testimonialLazyLoad, testimonials, isLoading, hasMore } = useTestimonialStore()

    useEffect(() => {
        testimonialList()
    }, []);

    console.log(testimonials)

    {/* Modal pour ajouter un témoignange */}

    const [ openModal, setOpenModal ] = useState<boolean>(false)

    const closeModal = () => {
        setOpenModal(false)
    }

    {/* Affichage de la date */}

    const formatedDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }
    return (
        <main id="testimonials-section" className={styles['testimonials-section']}>
            <div className={styles['container']}>
                <section className={styles['testimonials']}>
                    <div className={styles['testimonials__header']}>
                        <h2 className={styles['testimonials__title']}>
                            Nos clients
                            <span>témoignent</span>
                        </h2>
                        <p className={styles['testimonials__subtitle']}>
                            Découvrez les expériences des personnes qui nous font confiance pour améliorer leur
                            bien-être au quotidien.
                        </p>
                    </div>
                </section>

                {isLoading ? (
                    <section className={styles['loading-state']}>
                        <p className={styles['loading-text']}>Chargement…</p>
                    </section>
                ) : !isLoading && testimonials.length > 0 ? (
                    <section className={styles['testimonials-card']}>
                        <div className={styles['testimonials-card__elems']}>
                            {testimonials.map((t) => (
                                <div className={styles['testimonials-card__items']} key={t.id}>
                                    <div className={styles['testimonials-card__content']}>
                                        <div className={styles['testimonials-card__stars']}>
                                            {[1, 2, 3, 4, 5].map((n, index) => (
                                                <span key={index}>{n <= t.rating ? '⭐' : '☆'}</span>
                                            ))}
                                        </div>
                                        <p className={styles['testimonials-card__text']}>
                                            {t.message}
                                        </p>
                                        <div className={styles['testimonials-card__user']}>
                                            <Image
                                                src={t?.picture?.filename || NoImage}
                                                alt={'Photos clients'}
                                                width={80}
                                                height={80}
                                            />
                                            <div>
                                                <div className={styles['name']}>
                                                    {t.author}
                                                </div>
                                                <div className={styles['role']}>
                                                    {t.job}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className={styles['testimonial-no-card']}>
                        <p>Aucun témoignage pour le moment...</p>
                    </section>
                )}

                {hasMore && (
                    <section className={styles['testimonials-load-more']}>
                        <button className={styles['btn-load']} onClick={() => testimonialLazyLoad()}>
                            <span>Charger plus de témoignages</span>
                        </button>
                    </section>
                )}

                <section className={styles['testimonials-cta']}>
                    <p>Vous aussi, partagez votre expérience</p>
                    <p>Vous êtes client ?</p>
                    <button
                        onClick={() => setOpenModal(true)}
                        className={`${styles['btn']} ${styles['btn-review']}`}>
                        ✍ Laisser un avis
                    </button>
                </section>
            </div>

            <ModalTestimonial
                openModal={openModal}
                closeModal={closeModal}
            />
        </main>
    )
}

