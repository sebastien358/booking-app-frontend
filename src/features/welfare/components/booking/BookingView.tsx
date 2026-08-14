'use client'

import styles from './bookingViews.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useBookingModalStore} from "@/store/bookingModal.store";
import {useEffect, useState} from "react";
import {useCategoryStore} from "@/store/category.store";
import {useServiceStore} from "@/store/service.store";

export default function BookingView() {

    {/* STORE MODAL BOOKING */}

    const { bookingBoolean, closeModalBooking } = useBookingModalStore()

    {/* CATEGORY STORE */}

    const { categoriesList, categories } = useCategoryStore()

    useEffect(() => {
        categoriesList()
    }, []);

    {/* SELECTED CATEGORY */}

    type Category = { id: number; name: string, slug: string };

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string ,| null>(null)

    useEffect(() => {
        if (categories && categories.length > 0 && categoryId === null) {
            setCategoryId(categories[0].id);
            setCategoryName(categories[0].slug)
        }
    }, [categories, categoryId])

    const onClickCategory = (categorie: Category) => {
        setCategoryId(categorie.id)
        setCategoryName(categorie.slug)
    }

    const isActiveCategory = (categorie: Category) => {
        return categorie.id === categoryId
    }

    {/* SERVICES */}

    const { servicesList, services } = useServiceStore()

    useEffect(() => {
        servicesList()
    }, []);

    const [serviceMenu, setServiceMenu] = useState<boolean>(false)
    const [serviceId, setServiceId] = useState<number | null>(null)

    const onClickService = (service) => {
        setServiceId(service.id)
    }

    const isActiveService = (service) => {
        return service.id === serviceId
    }

    if (bookingBoolean) {
        return (
            <main className={styles['page-wrapper']}>
                <div className={styles['container']}>
                    <section className={styles['booking']}>
                        <div className={styles['booking__description']}>
                            <p>Préparez votre rendez-vous<strong></strong></p>
                            <FontAwesomeIcon icon={faXmark} onClick={() => closeModalBooking()} />
                        </div>

                        {/* Separator */}
                        <div className={styles['separator-top']}></div>

                        <div className={styles['booking__title']}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>

                        {/* Barre de progression */}

                        {/* booking context ready

                          <div className={styles['loading-overlay']}>
                            <div className={styles['loading-overlay__loader']}></div>
                        </div>

                        */}


                        <div>
                            {/* Booking category */}

                            {categories && categories.length > 0 && (
                                <section className={styles['booking-category']}>
                                    {categories.map((categorie) => (
                                        <button
                                            key={categorie.id}
                                            className={`${styles['btn']} ${styles['btn-category']} ${isActiveCategory(categorie) ? styles['active'] : ''}`}
                                            onClick={() => onClickCategory(categorie)}
                                        >
                                            {categorie.name}
                                        </button>
                                    ))}
                                </section>
                            )}

                            {/* Booking services */}
                            <section className={styles['booking-service']}>
                                <div>
                                    <div className={styles['booking-service__description']}>
                                        <p className={styles['booking-service__description-text']}>
                                            <span>📋</span>Type de consultation
                                        </p>
                                    </div>
                                    <div className={styles['service-label']} onClick={() => setServiceMenu(prev => !prev)}>
                                        Choisissez votre prestation
                                        <span className={styles['service-icon']}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </span>
                                    </div>
                                    {serviceMenu && (
                                        <div className={styles['service-menu']}>
                                            {services?.map((service) => (
                                                <div key={service.id} className={`${styles['service-items']} ${isActiveService(service) ? styles['active-service'] : ''}`} onClick={() => onClickService(service)}>
                                                    <span className={styles['name']}>{service.name}</span>
                                                    <span>{service.duration} min</span>
                                                    <span>{service.price}€</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Booking staff */}
                            <section className={styles['booking-staff-wrapper']}>
                                <div className={styles['booking-staff']}>
                                    <p className={styles['booking-staff__label']}>
                                        Avec qui ?
                                    </p>
                                    <div className={styles['booking-staff__grid']}>
                                        <label className={styles['booking-staff__cards']}>
                                            <div className={styles['booking-staff__card__content']}>
                                                <div className={styles['booking-staff__card__content__avatar']}>
                                                    <img src="" className={styles['']} />
                                                    <span className={styles['name']}>Maître {/* prénom */}</span>
                                                </div>
                                                <input type="radio" name="staff" />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <div className={styles['booking__placeholder']}>
                                <p>👤 Veuillez sélectionner un avocat pour afficher les disponibilités</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        )
    }
}