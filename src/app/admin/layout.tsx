"use client"

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth.store";
import styles from "@/app/admin/layout.module.scss";
import Sidebar from "@/features/admin/components/Sidebar";

export default function adminLayout({children}: {children: React.ReactNode}) {
    const { hasHydrated, token, isAdmin, isUser } = useAuthStore()

    const router = useRouter()

    useEffect(() => {
        if (!hasHydrated) return

        if (!token || !isAdmin()) {
            router.push('/login')
        }

        if (!isUser() && isAdmin()) {
            router.push('/admin/bookings')
        }

        if (!hasHydrated) return null

    }, [hasHydrated, token, isAdmin, isUser]);

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