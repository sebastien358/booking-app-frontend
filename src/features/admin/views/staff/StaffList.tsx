"use client"

import styles from './StaffList.module.scss'

import {useStaffAdminStore} from "@/store/admin/staffAdmin.store";
import {useEffect} from "react";
import Link from "next/link";
import InputSearch from "@/components/input-search/InputSearch";

export default function StaffList() {

    const { staffsList, staffLazyLoad, staffs, isLoading, term, hasMore } = useStaffAdminStore()

    useEffect(() => {
        staffsList()
    }, [staffsList]);

    const formatedDate = (date: string) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    return (
        <main>
            {isLoading ? (
                <section  className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && staffs.length > 0 ? (
                <section className={styles['staff-admin']}>
                    <div className={styles['staff-admin__container']}>
                        {staffs?.map((staff) => (
                            <Link
                                key={staff.id}
                                href={`/admin/staffs/${staff.id}`}
                                className={styles['staff-admin__grid']}
                            >
                            <div className={styles['staff-admin__infos']}>
                                <h3>{staff.firstname} - {staff.lastname}</h3>
                                <p>Date : {formatedDate(staff.created_at)}</p>
                            </div>
                            </Link>
                        ))}
                    </div>
                    {hasMore && (
                        <div className={styles['staff-admin__load']}>
                            <button
                                onClick={() => staffLazyLoad()}
                                className={styles['btn-load']}
                            >
                                Charger plus
                            </button>
                        </div>
                    )}
                </section>
            ) : (
                <section className={styles['empty-state']}>
                    <p>Aucun contact pour le moment</p>
                </section>
            )}
        </main>
    )
}