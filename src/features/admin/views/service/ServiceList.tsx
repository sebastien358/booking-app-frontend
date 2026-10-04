'use client'

import styles from './ServiceList.module.scss'
import Link from "next/link";
import {useServiceAdminStore} from "@/store/admin/serviceAdmin.store";
import {useEffect} from "react";

export default function ServiceList() {

    const { serviceList, services, isLoading } = useServiceAdminStore()

    useEffect(() => {
        serviceList()
    }, []);

    return (
        <main>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && services.length > 0 ? (
                <section className={styles['service-admin']}>
                    <div className={styles['container']}>
                        {/* Search */}
                        <div className={styles['grid-container']}>
                            {services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={`/admin/services/${service.id}`}
                                    className={styles['grid-item']}
                                >
                                    <h3>{service.name}</h3>
                                    <p>{service.price} € • {service.duration} duration min</p>
                                    <p>Catégorie : {service.category.name}</p>
                                </Link>
                            ))}
                        </div>

                        <div className={styles['load-contact']}>
                            <button
                                className={styles['btn-load']}
                            >
                                Charger plus
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <section className={styles['empty-state']}>
                    <p>Aucun service pour le moment</p>
                </section>
            )}
        </main>
    )
}