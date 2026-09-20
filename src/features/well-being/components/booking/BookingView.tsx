'use client'

import styles from './bookingViews.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useBookingModalStore} from "@/store/bookingModal.store";
import {useEffect, useMemo, useState} from "react";
import {useCategoryStore} from "@/store/category.store";
import {useServiceStore} from "@/store/service.store";
import {useStaffStore} from "@/store/staff.store";
import noUser from '@/assets/images/no-user.png'
import Image from "next/image";
import ProgressBooking from "@/templates/progress-booking/ProgressBooking";
import {useBookingStore} from "@/store/booking.store";
import StripePaymentForm from "@/features/well-being/components/payment/StripePaymentForm";
import {useAuthStore} from "@/store/auth.store";
import {useRouter} from "next/navigation";
import BookingConfirm from "@/features/well-being/components/booking/BookingConfirm";

export default function BookingView() {

    const {
        setBookingDraft,
        bookingDraft,
        axiosSlots,
        setServiceName,
        serviceName,
        setStaffName,
        staffName,
        setServicePrice,
        servicePrice,
        setServiceDuration,
        serviceDuration,
        setSelectedDay,
        selectedDay,
        setSlotLabel,
        slotLabel,
        setProgressStep,
        progressStep,
        informationCompletedOne,
        informationCompletedTwo,
        informationCompletedThree,
        loadingSlots,
        slots,
        successBooking
    } = useBookingStore()

    {/* STORE MODAL BOOKING */}

    const { bookingBoolean, closeModalBooking } = useBookingModalStore()

    {/* CATEGORY STORE */}

    const { categoriesList, categories, isLoadingCategory } = useCategoryStore()

    useEffect(() => {
        categoriesList()
    }, []);

    {/* SELECTED CATEGORY */}

    type Category = {
        id: number
        slug: string
    }

    useEffect(() => {
        if (categories.length > 0 && bookingDraft.bookingCategoryId === null) {
            setBookingDraft({ bookingCategoryId: categories[0].id })
        }
    }, [categories, bookingDraft.bookingCategoryId]);

    const onClickCategory = (category: Category) => {
        setBookingDraft({ bookingCategoryId: category.id })
    }

    const isActiveCategory = (category: Category) => {
        return category.id === bookingDraft.bookingCategoryId
    }


    {/* SERVICES */}

    type Service = {
        id: number
        name: string
        duration: number
        price: number
    }

    const { servicesList, services, isLoadingService } = useServiceStore()

    useEffect(() => {
        servicesList()
    }, []);

    const filteredServices = useMemo(() => {
        if (!services || !bookingDraft.bookingCategoryId) return [];

        return services.filter((service) => {
            return service.category.id === bookingDraft.bookingCategoryId
        })
    }, [services, bookingDraft.bookingCategoryId])

    const [serviceMenu, setServiceMenu] = useState<boolean>(false)

    const onClickService = (service: Service) => {
        setBookingDraft({ bookingServiceId: service.id })
        setServiceName(service.name)
        setServiceDuration(service.duration)
        setServicePrice(service.price)
        setServiceMenu(false)
    }

    const isActiveService = (service: Service) => {
        return service.id === bookingDraft.bookingServiceId
    }

    {/* STAFFS */}

    const { staffList, staffs, isLoadingStaff } = useStaffStore()

    useEffect(() => {
        staffList()
    }, []);

    type Staff = {
        id: number
        firstname: string
    }

    const onClickStaff = (staff: Staff) => {
        setBookingDraft({ bookingStaffId: staff.id })
        setStaffName(staff.firstname)
    }

    {/* Integration Days */}

    const [now, setNow] = useState(() => new  Date())

    useEffect(() => {
        const clear = setInterval(() => setNow(new Date()), 60 * 1000)
        return () => clearInterval(clear)
    }, []);

    const availableDays = useMemo(() => {
        const days: {label: string, value: string}[] = []

        const isAfter18 = now.getHours() >= 18
        const startOffset = isAfter18 ? 1 : 0

        for (let i = startOffset; days.length < 10; i++) {
            const d = new Date(now)
            d.setDate(d.getDate() + i)

            if (d.getDay() === 0) continue

            days.push({
                label: d.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                }).replace(/\./g, ''),
                value: d.toLocaleDateString('fr-CA')
            })
        }

        return days
    }, [now]);

    const [pageSize] = useState(3);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const maxIndex = useMemo(() => {
        return Math.max(0, Math.ceil(availableDays.length / pageSize) - 1)
    }, [availableDays, pageSize])

    const visibleDays = useMemo(() => {
        const start = carouselIndex * pageSize
        return availableDays.slice(start, start + pageSize)
    }, [carouselIndex, pageSize, availableDays])

    const prevDays = () => {
        if (carouselIndex > 0) setCarouselIndex(carouselIndex - 1)
    }

    const nextDays = () => {
        if (carouselIndex < maxIndex) setCarouselIndex(carouselIndex + 1)
    }

    {/* On Click Day and active day */}

    type Day = {
        label: string
        value: string
    }

    const onClickDay = (day: Day) => {
        setBookingDraft({ bookingDate: day.value })
        setSelectedDay(day.label)
    }

    const isActiveDay = (day: Day): boolean => {
        return (day.value === bookingDraft.bookingDate)
    }

    {/* Slots */}

// QUAND LES 4 VALEURS LOCALES CHANGENT -> ON MET A JOUR LE STORE -> ON CHARGE LES SLOTS

    useEffect(() => {
        if (visibleDays.length > 0 && !bookingDraft.bookingDate && !selectedDay) {
            setBookingDraft({ bookingDate: visibleDays[0].value })
        }

        setSelectedDay(visibleDays[0].label)
    }, [visibleDays, bookingDraft.bookingDate, selectedDay])

    useEffect(() => {
        if (!bookingDraft.bookingCategoryId || !bookingDraft.bookingServiceId || !bookingDraft.bookingStaffId || !bookingDraft.bookingDate) return

        setBookingDraft({
            bookingCategoryId: bookingDraft.bookingCategoryId,
            bookingServiceId: bookingDraft.bookingServiceId,
            bookingStaffId: bookingDraft.bookingStaffId,
            bookingDate: bookingDraft.bookingDate
        })

        axiosSlots()
    }, [bookingDraft.bookingCategoryId, bookingDraft.bookingServiceId, bookingDraft.bookingStaffId, bookingDraft.bookingDate])

    {/* Click Slot */}

    const { token, isUser, setShowLoginModal } = useAuthStore()

    const router = useRouter()

    type Slot = {
        start: string
        label: string
    }

    const onClickSelectedSlot = async (slot: Slot) => {
        setBookingDraft({ ...bookingDraft, bookingDatetime: slot.start })
        setSlotLabel(slot.label)

        if (!token && !isUser()) {
            setBookingDraft({ ...bookingDraft, bookingDatetime: slot.start })
            setShowLoginModal(true)
            setSlotLabel(slot.label)
            router.push('/login')
            return
        }
    }

    const isActiveSlot = (slot: Slot) => {
        return slot.start === bookingDraft.bookingDatetime
    }

    {/* Loading : Catégory, Service, Staff */}

    const isLoadingPageStep1 = () => {
        return (isLoadingCategory || isLoadingService || isLoadingStaff)
    }

    {/* Progress Step */}

    useEffect(() => {
        if (bookingDraft.bookingCategoryId && bookingDraft.bookingServiceId && bookingDraft.bookingStaffId && bookingDraft.bookingDatetime && successBooking) {
            setProgressStep(4)
        } else if (bookingDraft.bookingCategoryId && bookingDraft.bookingServiceId && bookingDraft.bookingStaffId && bookingDraft.bookingDatetime) {
            setProgressStep(3)
        } else if(bookingDraft.bookingCategoryId && bookingDraft.bookingServiceId && bookingDraft.bookingStaffId) {
            setProgressStep(2)
        } else {
            setProgressStep(1)
        }
    }, [bookingDraft.bookingCategoryId, bookingDraft.bookingServiceId, bookingDraft.bookingStaffId, bookingDraft.bookingDatetime])

    if (bookingBoolean) {
        if (!informationCompletedOne()) {
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

                            {/* Svg */}
                            <div className={styles['booking__title']}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>

                            {/* Barre de progression */}
                            <ProgressBooking progressStep={progressStep} />

                            {/* loading */}
                            {isLoadingPageStep1() ? (
                                <div className={styles['loading-overlay']}>
                                    <div className={styles['loading-overlay__loader']}></div>
                                </div>
                            ) : (
                                <>
                                    {/* Booking category */}
                                    {categories && categories.length > 0 && (
                                        <section className={styles['booking-category']}>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    className={`${styles['btn']} ${styles['btn-category']} ${isActiveCategory(category) ? styles['active'] : ''}`}
                                                    onClick={() => onClickCategory(category)}
                                                >
                                                    {category.name}
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
                                                {serviceName || 'Choisissez votre prestation'}
                                                <span className={styles['service-icon']}>
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            </span>
                                            </div>
                                            {serviceMenu && (
                                                <div className={styles['service-menu']}>
                                                    {filteredServices?.map((service) => (
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
                                                {staffs.map((staff) => (
                                                    <label className={styles['booking-staff__cards']} key={staff.id}>
                                                        <div className={styles['booking-staff__card__content']}>
                                                            <div className={styles['booking-staff__card__content__avatar']}>
                                                                <Image
                                                                    src={staff?.picture?.filename || noUser}
                                                                    alt={staff.firstname}
                                                                    className={styles['avatar']}
                                                                    height={30}
                                                                    width={30}
                                                                />
                                                                <span className={styles['name']}>Pro: {staff.firstname}</span>
                                                            </div>
                                                            <input type="radio" name="staff" onClick={() => onClickStaff(staff)} />
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                    <div className={styles['booking__placeholder']}>
                                        <p>👤 Veuillez sélectionner un avocat pour afficher les disponibilités</p>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </main>
            )
        } else if (!informationCompletedTwo()) {
            return (
                <main className={styles['page-wrapper']}>
                    <div className={styles['container']}>
                        <section className={styles['booking']}>
                            <div className={styles['booking__description']}>
                                <div className={styles['booking__description__text']}>
                                    <p>{serviceName}</p>
                                    <p>• Accompagnante : {staffName}</p>
                                    <p>• Durée : {serviceDuration} min</p>
                                </div>

                                <FontAwesomeIcon icon={faXmark} onClick={() => closeModalBooking()} />
                            </div>

                            {/* Separator */}
                            <div className={styles['separator-top']}></div>

                            {/* Svg */}
                            <div className={styles['booking__title']}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>

                            {/* Barre de progression */}
                            <ProgressBooking progressStep={progressStep} />

                            {/* CRÉNEAUX HORAIRES */}
                            <h3 className={styles['booking-reservation-title']}>Choisissez votre créneau 📅</h3>

                            <div className={styles['booking__items']}>

                                {/* JOURS TOUJOURS VISIBLES */}
                                <div className={styles['booking__pagination']}>
                                    <button onClick={() => prevDays()} className={styles['prev-day']}>‹</button>

                                    <div className={styles['days-list']}>
                                        {visibleDays.map((day) => (
                                            <div key={day.value}>
                                                <button onClick={() => onClickDay(day)} className={`${styles['day-item']} ${isActiveDay(day) ? styles['active'] : ''}`}>{day.label}</button>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => nextDays()} className={styles['next-day']}>›</button>
                                </div>

                                {/* LOADER - SLOTS - NO SLOTS */}
                                {loadingSlots ? (
                                    <div className={styles['loading']}>
                                        <span className={styles['loading__loader']}></span>
                                    </div>
                                ) : slots?.length > 0 ? (
                                    <div className={styles['booking__slots']}>
                                        {slots.map((slot) => (
                                            <button key={slot.label} onClick={() => onClickSelectedSlot(slot)} className={`${styles['btn']} ${styles['btn-reservation']} ${isActiveSlot(slot) ? styles['active'] : ''}   `}>{slot.label}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles['booking__no__reservation']}>
                                        <p>Aucun créneau disponible.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            )
        } else if (!informationCompletedThree()) {
            return (
                <main className={styles['page-wrapper']}>
                    <div className={styles['container']}>
                        <section className={styles['booking']}>
                            <div className={styles['booking__description']}>
                                <div className={styles['booking__description__text']}>
                                    <p>{serviceName}</p>
                                    <p>• Accompagnante : {staffName}</p>
                                    <p>• {selectedDay} - <strong>{slotLabel}</strong></p>
                                    <p>• Durée : {serviceDuration} min - <strong>{servicePrice}€</strong></p>
                                </div>
                                <FontAwesomeIcon icon={faXmark} onClick={() => closeModalBooking()} />
                            </div>

                            {/* Separator */}
                            <div className={styles['separator-top']}></div>

                            {/* Svg */}
                            <div className={styles['booking__title']}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>

                            {/* Barre de progression */}
                            <ProgressBooking progressStep={progressStep} />

                            {/* Form de payment */}
                            <StripePaymentForm />
                        </section>
                    </div>
                </main>
            )
        } else {
            return (
                <main className={styles['page-wrapper']}>
                    <div className={styles['container']}>
                        <section className={styles['booking']}>
                            <div className={styles['booking__description']}>
                                <div className={styles['booking__description__text']}>
                                    <p>{serviceName}</p>
                                    <p>• Accompagnante : {staffName}</p>
                                    <p>• Durée : {serviceDuration} min</p>
                                </div>
                                <FontAwesomeIcon icon={faXmark} onClick={() => closeModalBooking()} />
                            </div>

                            {/* Separator */}
                            <div className={styles['separator-top']}></div>

                            {/* Svg */}
                            <div className={styles['booking__title']}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 13c2-2 4-2 6 0s4 2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>

                            <BookingConfirm selectedDay={selectedDay} slotLabel={slotLabel} />
                        </section>
                    </div>
                </main>
            )
        }
    }
}