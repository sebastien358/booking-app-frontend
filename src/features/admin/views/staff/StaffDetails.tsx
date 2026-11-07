"use client"

import styles from './StaffDetails.module.scss'
import {StaffData} from "@/store/admin/staffAdmin.store";
import NoUser from '@/assets/images/no.svg'
import Image from "next/image";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {ChangeEvent, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

type StaffProps = {
    id: string
    staffDelete: (id: string) => Promise<void>
    staffDeleteImage: (id: string) => Promise<void>
    staffEdit: (id: string, newFile: File) => Promise<void>
    staffToggle: (id: string) => Promise<void>
    isLoading: boolean
    currentStaff: StaffData | null
}

export default function StaffDetails({ id, staffDelete, staffDeleteImage, staffEdit, staffToggle, isLoading, currentStaff }: StaffProps) {

    const router = useRouter()

    {/* Gestion Modal */}

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Modifier la photo d'un salarié */}

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onChangeEditFile = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const newFile = e?.target?.files?.[0]
            if (!newFile) return
            if (newFile instanceof File) {
                await staffDeleteImage(id)
            }
            await staffEdit(id, newFile)
        } catch (err: any) {
            console.error(err)
            throw err
        }
    }

    const openInputFile = () => {
        fileInputRef.current?.click()
    }

    {/* Supprimer un Salarié */}

    const onClickDelete = async () => {
        await staffDelete(id)
        setActiveModal(false)
        router.push('/admin/staffs')
    }

    {/* Gestion employé actif */}

    const toggleStaff = async () => {
        await staffToggle(id)
    }

    return (
        <main className={styles['staff-container']}>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && currentStaff ? (
                <section className={styles['staff-details']}>
                    <div className={styles['staff-details__picture']}>
                        <Image
                            className={styles['img']}
                            src={currentStaff?.picture?.filename || NoUser}
                            alt={'Image du salarié'}
                            width={100}
                            height={230}
                        />

                        <input
                            onChange={(e) => onChangeEditFile(e)}
                            ref={fileInputRef}
                            type={"file"}
                            accept={"image/aces"}
                            hidden
                        />

                        <button
                            onClick={() => openInputFile()}
                            className={styles['staff-details__button--img']}
                        >
                          <FontAwesomeIcon icon={faCamera} />
                        </button>
                        {/* L'input caché */}
                    </div>
                   <div className={styles['staff-details__infos']}>
                        <p>{currentStaff.firstname}</p>
                        <p>{currentStaff.lastname}</p>
                       <div className={styles['staff-details__buttons']}>
                           <button
                               onClick={() => setActiveModal(true)}
                               className={styles['btn-delete']}
                           >
                               Supprimer
                           </button>
                           <button
                               onClick={() => toggleStaff()}
                               className={`${currentStaff.is_active ? styles['btn-inactive'] : styles['btn-active']}`}
                           >
                               {currentStaff.is_active ? 'Désactiver' : 'Activer'}
                           </button>
                       </div>

                    </div>
                    <ModalConfirm
                        activeModal={activeModal}
                        closeModal={closeModal}
                        onClickDelete={onClickDelete}
                        dropdownStaffAdmin
                    />
                </section>
            ) : (
                <section className={styles['empty-state']}>
                    <p>Aucun témoignage pour le moment</p>
                </section>
            )}
        </main>
    )
}