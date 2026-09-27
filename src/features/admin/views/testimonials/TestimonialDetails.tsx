'use client'

import styles from './TestimonialDetails.module.scss'
import {TestimonialData} from "@/store/testimonial.store";
import Image from "next/image";
import NoUser from '@/assets/images/no-user.png'

type TestimonialProps = {
    id: string
    testimonialAdminToggle: (id: string) => Promise<void>
    currentTestimonial: TestimonialData | null
    isLoading: boolean
}

export default function TestimonialDetails({ id, testimonialAdminToggle, currentTestimonial, isLoading }: TestimonialProps) {

    const toggleTestimonial = async () => {
        await testimonialAdminToggle(id)
    }

    const deleteTestimonial = () => {
        console.log(id)
    }

    console.log(currentTestimonial)

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
                                        ferferfre
                                    </div>
                                    <div className={styles['sub']}>
                                        <span className={styles['date']}>date</span>
                                        <span className={styles['sep']}>·bgbg</span>
                                        <span className={styles['job']}>{currentTestimonial.job}</span>
                                    </div>
                                </div>
                                {currentTestimonial.picture ? (
                                    <Image src={currentTestimonial?.picture?.filename} className={styles['img-testimonial']} alt="" width={60} height={60} />
                                ) : (
                                    <Image src={NoUser} className={styles['img-not-found']} alt="" width={45} height={45} />
                                )}
                            </div>
                            <div className={styles['message-body']}>
                                <h3 className={styles['date-title']}></h3>
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
                                    onClick={() => deleteTestimonial()}
                                    className={`${styles['btn']} ${styles['btn-delete']}`}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>


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