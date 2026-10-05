"use client"

import styles from './ServiceList.module.scss'
import Link from "next/link";
import {useServiceAdminStore} from "@/store/admin/serviceAdmin.store";
import {useEffect} from "react";
import InputSearch from "@/components/input-search/InputSearch";

export default function ServiceList() {

    const { serviceList, serviceSearch, serviceLazyLoad, services, term, isLoading, hasMore } = useServiceAdminStore()

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

                        <InputSearch
                            term={term}
                            search={serviceSearch}
                            placeholder='Rechercher un service...'
                            activeSearch='service-admin'
                        />

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

                        {hasMore && (
                            <div className={styles['load-contact']}>
                                <button
                                    onClick={() => serviceLazyLoad()}
                                    className={styles['btn-load']}
                                >
                                    Charger plus
                                </button>
                            </div>
                        )}

                    </div>
                </section>
            ) : (
                <section>
                    <InputSearch
                        term={term}
                        search={serviceSearch}
                        placeholder='Rechercher un service...'
                        activeSearch='service-admin'
                    />

                    <div className={styles['empty-state']}>
                        <p>Aucun service pour le moment</p>
                    </div>
                </section>
            )}
        </main>
    )
}