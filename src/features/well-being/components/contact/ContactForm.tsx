"use client"

import styles from './ContactForm.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod'
import {useState} from "react";
import {ContactData, useContact} from "@/store/contact.store";
import BookingView from "@/features/well-being/components/booking/BookingView";

const DELAY_TIMEOUT = 2000

const schema = z.object({
    firstname: z.string().trim().min(1, 'Veuillez renseigner votre prénom.').max(70, 'Le prénom ne peut pas dépasser 70 caractères.'),
    lastname: z.string().trim().min(1, 'Veuillez renseigner votre nom.').max(70, 'Le nom ne peut pas dépasser 70 caractères.'),
    email: z.string().trim().email('Veuillez renseigner une adresse email valide.'),
    message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères.').max(1500, 'Le message ne peut pas dépasser 1500 caractères.')
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {

    const { contactNew, resetContact, errorMessage } = useContact()

    const { register, handleSubmit, reset, formState: {isSubmitting, errors} } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const onSubmit = async (data: ContactData) => {
        try {
            await contactNew(data)
            displaySuccessMsg('Le message a été envoyé')
        } catch(err: any) {
            displayErrorMsg()
        }
    }

    const displaySuccessMsg = (msg: string) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
            reset()
        }, DELAY_TIMEOUT)
    }

    const displayErrorMsg = () => {
        setTimeout(() => {
            resetContact()
        }, DELAY_TIMEOUT)
    }

    return (
        <main className={styles.contact}>
            <div className={styles.contact__container}>
                {/* FORM */}
                <section className={styles.contact__form}>
                    <h2 className={styles.contact__title}>Contactez-nous</h2>
                    <p className={styles.contact__subtitle}>Une question ?</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <input {...register('firstname')} placeholder="Prénom" />
                            {errors.firstname && <span className={styles.errorField}>{errors.firstname.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <input {...register('lastname')} placeholder="Nom" />
                            {errors.lastname && <span className={styles.errorField}>{errors.lastname.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <input {...register('email')} placeholder="Email" type="email"/>
                            {errors.email && <span className={styles.errorField}>{errors.email.message}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <textarea {...register('message')} placeholder="Votre message..."/>
                            {errors.message && <span className={styles.errorField}>{errors.message.message}</span>}
                        </div>

                        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                        <div className={styles.formSubmit}>
                            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Chargement...' : 'Soumettre'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* INFO */}
                <section className={styles.contact__info}>
                    <h3>La pizzéria</h3>
                    <p className={styles.contact__address}>
                        18 rue de la Sérénité <br />
                        75003 Paris
                    </p>
                    <ul className={styles.contact__hours}>
                        <li>🕒 Lun – Ven : 9h – 20h</li>
                        <li>🕒 Samedi : 9h – 20h</li>
                    </ul>
                    <p className={styles.contact__phone}>📞 01 23 45 67 89</p>
                    <p className={styles.contact__mail}>✉️ contact@pizzeria.fr</p>
                    <div className={styles.contact__badges}>
                        <span className={styles.badgeGreen}>Réponse sous 24h</span>
                        <span className={styles.badgeYellow}>🍕 Commande en ligne 7j/7</span>
                    </div>

                    {/* iframe */}
                    <div className={styles.contact__map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12294.319109934564!2d-0.24133006287153588!3d49.28515163344128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480a6156d5655ba5%3A0x1eb3a9d9ae79f46a!2sPlage%20de%20Ouistreham!5e0!3m2!1sfr!2sfr!4v1765478462795!5m2!1sfr!2sfr"
                            width="400"
                            height="300"
                            style={{border: 0}}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>

            {/* Modal de réservation */}
            <BookingView />
        </main>
    )
}