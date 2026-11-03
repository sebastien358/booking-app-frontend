"use client"

import styles from './StaffForm.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod';
import {StaffFormData, useStaffAdminStore} from "@/store/admin/staffAdmin.store";
import {ChangeEvent, useState} from "react";
import {useRouter} from "next/navigation";

const DELAY_TIMEOUT = 2000

const MAX_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export const schema = z.object({
    firstname: z.string().trim()
        .min(3, { message: 'Prénom: min 3 caractères' })
        .max(50, { message: 'Prénom: max 50 caractères' }),
    lastname: z.string().trim()
        .min(3, { message: 'Nom: min 3 caractères' })
        .max(50, { message: 'Nom: max 50 caractères' }),
    picture: z
        .instanceof(File)
        .nullable()
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: 'L\'image ne doit pas dépasser 5Mo'
        })
        .refine((file) => !file || MAX_FILE_TYPES.includes(file.type), {
            message: 'Format invalide: jpg, png, webp uniquement'
        })
})

export default function StaffForm() {
    const { staffForm, resetSuccessMessage, resetErrorMessage, successMessage, errorMessage } = useStaffAdminStore()

    const { register, handleSubmit, setValue, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const [filename, setFilename] = useState<string | null>(null)

    const changeInputImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0]
        if (!file) {
            setValue('picture', null, { shouldValidate: true })
            return
        }
        setValue('picture', file, { shouldValidate: true })
        setFilename(file.name)
    }

    const onSubmit = async (data: StaffFormData) => {
        try {
            await staffForm(data)
            handleSuccess()
        } catch (err: any) {
            handleError()
        }
    }

    const router = useRouter()

    const handleSuccess = () => {
        setTimeout(() => {
            resetSuccessMessage()
            router.push('/admin/staffs')
            reset()
        }, DELAY_TIMEOUT)
    }

    const handleError = () => {
        setTimeout(() => {
            resetErrorMessage()
        }, DELAY_TIMEOUT)
    }

    return (
        <main className={`${styles['staff']} ${styles['container']}`}>
            <div className={styles['staff__container']}>
                <h2 className={styles['staff__title']}>Ajout Salarié</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles['staff__form']}>
                    <div className={styles['form-group']}>
                       <input {...register('firstname')} type={'text'} placeholder={'Prénom'} />
                        {errors.firstname && <p className={styles['error-field']}>
                            {errors.firstname.message}
                        </p>}
                    </div>
                    <div className={styles['form-group']}>
                        <input {...register('lastname')} type={'text'} placeholder={'Nom'} />
                        {errors.lastname && <p className={styles['error-field']}>
                            {errors.lastname.message}
                        </p>}
                    </div>
                    <div className={styles['form-group']}>
                        <div className={styles['file']}>
                            <div className={styles['file__label']}>
                                <input className={styles['file__input']} type={'file'} onChange={(e) => changeInputImage(e)} />
                                <span>{filename || 'Choisir une image'}</span>
                            </div>
                            {errors?.picture && <p className={styles['error-field']}>
                                {errors?.picture?.message}
                            </p>}
                        </div>
                    </div>

                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

                    <div className={styles['form-submit']}>
                        <button className={styles['btn-submit']} disabled={isSubmitting}>
                            {isSubmitting ? 'Envoi en cours…' : 'Envoyé' }
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}