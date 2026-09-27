'use client'

import styles from './InputSearch.module.scss'
import {usePathname} from "next/navigation";
import React from "react";

type InoutSearchProps = {
    term: string | null,
    search: (term: string | null) => void
    placeholder: string
    activeSearch: string
}

export default function InputSearch({ term, search, placeholder, activeSearch }: InoutSearchProps) {

    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    const searchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (activeSearch) {
            case 'booking-admin':
                search(e.target.value)
                break
            case 'testimonial-admin':
                search(e.target.value)
                break
            default:
                return ""
        }
    }

    return (
        <section className={styles['search']}>
            <div className={styles['search__container']}>
                {/* Filtration search */}
                <div className={styles['search__input']}>
                    <input
                        value={term}
                        onChange={(e) => searchData(e)}
                        placeholder={placeholder}
                        type={"text"}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                {!isAdmin && (
                    <div className={styles['search__counter']}>
                        <span className="search__total">au total</span>
                    </div>
                )}
            </div>
        </section>
    )
}