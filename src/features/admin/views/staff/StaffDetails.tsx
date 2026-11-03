"use client"

import styles from './StaffDetails.module.scss'

import {StaffData} from "@/store/admin/staffAdmin.store";
import NoUser from '@/assets/images/no.svg'
import Image from "next/image";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useState} from "react";
import {useRouter} from "next/navigation";

type StaffProps = {
    id: string
    staffDelete: (id: string) => Promise<void>
    staffToggle: (id: string) => Promise<void>
    isLoading: boolean
    currentStaff: StaffData | null
}

export default function StaffDetails({ id, staffDelete, staffToggle, isLoading, currentStaff }: StaffProps) {
    console.log(currentStaff)

    const [activeModal, setActiveModal] = useState<boolean>(false)

    const closeModal = () => {
        setActiveModal(false)
    }

    const router = useRouter()

    const onClickDelete = async () => {
        await staffDelete(id)
        setActiveModal(false)
        router.push('/admin/staffs')
    }

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
                    </div>
                   <div className={styles['staff-details__info']}>
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