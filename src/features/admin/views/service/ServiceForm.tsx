"use client"

import styles from './ServiceForm.module.scss'

import {useCategoryAdminStore} from "@/store/admin/categoryAdmin.store";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ServiceFormData, useServiceAdminStore} from "@/store/admin/serviceAdmin.store";
import {z} from "zod";


const DELAY_TIMEOUT = 2000

const schema = z.object({
    price: z
        .coerce
        .number()
        .min(1, { message: 'Le prix est requis' }),
    duration: z
        .coerce
        .number()
        .min(1, { message: 'La durée est requise' }),
    category: z
        .coerce.number()
        .min(1, { message: 'La catégorie est requise' }),
    name: z
        .string()
        .trim()
        .min(1, { message: 'Le nom du service est requis' })
        .max(150, { message: 'Le nom du service doit contenir au maximum 150 caractères' })
})

export default function ServiceForm() {

    {/* Store Category Data */}

    const { categoryAdminList, categories, isLoading } = useCategoryAdminStore()

    useEffect(() => {
        categoryAdminList()
    }, [categoryAdminList]);

    {/* useForm */}

    const {register, reset, handleSubmit, formState: {isSubmitting, errors}} = useForm({
        resolver: zodResolver(schema),
        defaultValues: ({
            price: null,
            duration: null,
            category: null,
            name: ""
        })
    })

    {/* Store Category Data */}

    const { serviceCreate, resetErrorForm, errorMessage } = useServiceAdminStore()

    {/* Gestion de la validation du formulaire */}

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    const router = useRouter()

    const onSubmit = async (data: ServiceFormData) => {
        try {
            await serviceCreate(data)
            handleSuccessMessage('Le service a bien été ajouté')
        } catch (err: unknown) {
            handleErrorMessage()
        }
    }

    const handleSuccessMessage = (msg: string | null) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            router.push('/admin/services')
            setSuccessMessage(null)
            reset()
        }, DELAY_TIMEOUT)
    }

    const handleErrorMessage = () => {
        setTimeout(() => {
            resetErrorForm()
        }, DELAY_TIMEOUT)
    }

    return (
        <main className={`${styles['staff']} ${styles['container']}`}>
            {/* FORMULAIRE */}
            <div className={styles['staff__form']}>
                <h2 className={styles['staff__title']}>Ajout Service</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['form-group']}>
                        <input type={"number"} {...register('price')} placeholder="Prix" />
                        {errors.price && <span className={styles['error-field']}>
                            {errors.price.message}
                        </span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('duration')} type="number" placeholder="Duration" />
                        {errors.duration && <span className={styles['error-field']}>
                                {errors.duration.message}
                        </span>}
                    </div>

                    <div className={styles['form-group']}>

                        {isLoading ? (
                            <p className={styles['loading-select']}>Chargement…</p>
                        ) : !isLoading && categories ? (
                            <select {...register('category')} defaultValue={""}>
                                <option value={""} disabled>Choisir une option</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        ) : null}

                        {errors.category && <span className={styles['error-field']}>
                            {errors.category.message}
                        </span>}
                    </div>

                    <div className={styles['form-group']}>
                        <textarea {...register('name')} placeholder="Nom du service"></textarea>
                        {errors.name && <span className={styles['error-field']}>
                            {errors.name.message}
                        </span>}
                    </div>

                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

                    <div className={styles['form-submit']}>
                        <button className={styles['btn-submit']} disabled={isSubmitting}>
                            {isSubmitting ? 'Envoi en cours…' : 'Envoyé'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}