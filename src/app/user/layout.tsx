"use client"

import React, {useEffect} from "react";
import styles from "@/app/admin/layout.module.scss";
import Sidebar from "@/features/admin/components/Sidebar";
import {useAuthStore} from "@/store/auth.store";
import {useRouter} from "next/navigation";

export default function UserLayout({children}: {children: React.ReactNode}) {

    const { hasHydrated, token, isUser } = useAuthStore()

    const router = useRouter()

    useEffect(() => {
        if (!hasHydrated) return

        if (!token || !isUser()) {
            router.push('/login')
        }

        if (token && isUser()) {
            router.push('/user/bookings')
        }

        if (!hasHydrated) return null
    }, [token, isUser]);

    return (
        <main className={styles['admin-layout']}>
            {/* Menu latéral */}
            <Sidebar />
            {/* Contenu principal */}
            <div className={styles['admin-content']}>
                {children}
            </div>
        </main>
    )
}