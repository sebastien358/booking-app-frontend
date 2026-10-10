"use client"

import styles from './TestimonialList.module.scss'
import Link from "next/link";
import {useTestimonialAdminStore} from "@/store/admin/testimonialAdmin.store";
import {useEffect} from "react";
import InputSearch from "@/components/input-search/InputSearch";

export default function TestimonialList() {

    const {
        testimonialAdminList,
        testimonialAdminLazyLoad,
        testimonialAdminSearch,
        testimonials,
        isLoading,
        hasMore,
        term
    } = useTestimonialAdminStore()

    useEffect(() => {
        testimonialAdminList()
    }, [])

    return (
        <>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : testimonials.length === 0 ? (
                <>
                    <InputSearch
                        term={term}
                        search={testimonialAdminSearch}
                        placeholder='Rechercher un témoignage...'
                        activeSearch='testimonial-admin'
                    />

                    <section className={styles['empty-state']}>
                        <p>Aucun témoignage pour le moment</p>
                    </section>
                </>

            ) : (
                <div className={styles['page']}>

                    <InputSearch
                        term={term}
                        search={testimonialAdminSearch}
                        placeholder='Rechercher un témoignage...'
                        activeSearch='testimonial-admin'
                    />

                    <section className={styles['testimonial']}>
                        <div className={styles['container']}>
                            <div className={styles['grid-container']}>
                                {testimonials.map((t) => (
                                    <Link
                                        key={t.id}
                                        href={`/admin/testimonials/${t.id}`}
                                        className={styles['grid-item']}
                                    >
                                        <div className={styles['testimonial__title']}>
                                            <h3>{t.author}</h3>
                                            <div className={styles['testimonial__stars']}>
                                                {[1, 2, 3, 4, 5].map((n, index) => (
                                                    <span
                                                        key={index}
                                                        className={n <= t.rating ? styles['full'] : styles['empty']}
                                                    >
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p>{t.message.slice(0, 40)}...</p>
                                        <p>{t.job}</p>
                                        <p className={styles['testimonial__is__read']}>
                                            {t.is_read ? '✅' : '❌'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            <div className={styles['load-contact']}>
                                {hasMore && (
                                    <button
                                        onClick={() => testimonialAdminLazyLoad()}
                                        className={`${styles['btn']} ${styles['btn-load']}`}
                                    >
                                        Charger plus
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}