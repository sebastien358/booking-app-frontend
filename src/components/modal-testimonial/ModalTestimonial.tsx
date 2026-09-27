'use client'

import styles from './ModalTestimonial.module.scss'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {ChangeEvent, useState} from "react";
import {TestimonialData, useTestimonialStore} from "@/store/testimonial.store";
import z from 'zod'

const DELAY_TIMEOUT = 2000
const DELAY_MODAL_TIMEOUT = 1000

type ModalTestimonialProps = {
    openModal: boolean,
    closeModal: () => void
}

export default function ModalTestimonial({ openModal, closeModal }: ModalTestimonialProps) {

    const { testimonialCreate, resetErrorMessage, errorMessage } = useTestimonialStore()

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    const MAX_FILE_TYPE = ['image/jpeg', 'image/png', 'image/webp']
    const MAX_FILE_SIZE = 5 * 1024 * 1024

    {/* Schema */}

    const schema = z.object({
        author: z
            .string()
            .trim()
            .min(3, { message: 'Le prénom doit contenir au moins 3 caractères' }),
        job: z
            .string()
            .trim()
            .min(3, { message: 'Le métier doit contenir au moins 3 caractères' })
            .max(50, { message: 'Le métier ne doit pas dépasser 50 caractères' }),
        rating: z.coerce
            .number({ message: 'Veuillez sélectionner une note' })
            .min(1, { message: 'Veuillez sélectionner une note' })
            .max(5, { message: 'La note maximum est 5' }),
        message: z
            .string()
            .trim()
            .min(30, { message: 'Votre message doit contenir au moins 30 caractères' }),
        image: z
            .custom<File | null>()
            .nullable()
            .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
                message: 'L\'image ne doit pas dépasser 5 Mo'
            })
            .refine((file) => !file || MAX_FILE_TYPE.includes(file.type), {
                message: 'Format accepté : JPEG, PNG ou WEBP'
            })
    })

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            author: "",
            job: "",
            rating: "",
            message: "",
            image: null
        }
    })

    {/* Gestion de l'image */}

    const [ filename, setFilename ] = useState<string | null>(null)

    const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFilename(file.name)
        setValue('image', file, { shouldValidate: true })
    }

    {/* Soumission du formulaire */}

    const onSubmit = async (data: TestimonialData) => {
        try {
            await testimonialCreate(data)
            handleSuccessMessage('Témoignage ajouté')
        } catch(err) {
            handleErrorMessage()
            console.error(err)
        }
    }

    const closeModalTimeout = () => {
        setTimeout(() => {
            closeModal()
            reset()
        }, DELAY_MODAL_TIMEOUT)
    }

    const handleSuccessMessage = (msg: string) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
            setFilename(null)
            closeModalTimeout()
        }, DELAY_TIMEOUT)
    }

    const handleErrorMessage = () => {
        setTimeout(() => {
            resetErrorMessage()
        }, DELAY_TIMEOUT)
    }

    return (
        <>
            {openModal && (
                <section className={styles['modal-testimonial']}>
                    <div className={styles['testimonials__form']}>
                        <div className={styles['testimonials__close__modal']}>
                            <button className={`${styles['btn']} ${styles['btn-modal-close']}`} onClick={() => closeModal()}>×</button>
                        </div>
                        <h2 className={styles['testimonials__title']}>Laissez votre avis</h2>
                        <form onSubmit={handleSubmit(onSubmit )}>
                            <div className={styles['form-group']}>
                                <input {...register('author')} type="text" placeholder="Votre nom" />
                                {errors.author && <span className={styles['error-field']}>{errors.author?.message}</span>}
                            </div>
                            <div className={styles['form-group']}>
                                <input {...register('job')} type="text" placeholder="Votre profession" />
                                {errors.author && <span className={styles['error-field']}>{errors.author?.message}</span>}
                            </div>
                            <div className={styles['form-group']}>
                                <div className={styles['select-wrapper']}>
                                    <select {...register('rating')} defaultValue="">
                                        <option value="" disabled>Notez votre expérience</option>
                                        <option value="5">⭐⭐⭐⭐⭐ – Excellent</option>
                                        <option value="4">⭐⭐⭐⭐ – Très bien</option>
                                        <option value="3">⭐⭐⭐ – Bien</option>
                                        <option value="2">⭐⭐ – Moyen</option>
                                        <option value="1">⭐ – Décevant</option>
                                    </select>
                                </div>
                                {errors.rating && <span className={styles['error-field']}>{errors.rating?.message}</span>}
                            </div>
                            <div className={styles['form-group']}>
                                <input {...register('image')} type="file" onChange={(e) => onChangeImage(e)} />
                                <small className={styles['img-file']}>{filename}</small>
                                <div className={styles['file-helper']}>
                                    <small className={styles['file-hint']}>
                                        Image facultative
                                    </small>
                                </div>
                            </div>
                            <div className={styles['form-group-textarea']}>
                                <textarea {...register('message')} placeholder="Votre Témoignage..."></textarea>
                                {errors.message && <span className={styles['error-field']}>{errors.message?.message}</span>}
                            </div>

                            {successMessage && (<p className={styles['success-message']}>{successMessage}</p>)}
                            {errorMessage && (<p className={styles['error-message']}>{errorMessage}</p>)}

                            <div className={styles['form-submit']}>
                                <button className={styles['btn-submit']} disabled={isSubmitting}>
                                    {isSubmitting ? 'Chargement...' : 'Envoyer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    )
}