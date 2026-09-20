"use client"

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth.store";
import styles from "@/app/admin/Layout.module.scss";
import Sidebar from "@/features/admin/components/Sidebar";

export default function adminLayout({children}: {children: React.ReactNode}) {
    const { hasHydrated, token, isAdmin } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!hasHydrated) return

        if (!token || !isAdmin()) {
            router.push('/login')
        }

        if (!hasHydrated) {
            return null
        }
    }, [hasHydrated, token, isAdmin]);

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