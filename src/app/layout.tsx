'use client'

import styles from './layout.module.scss'
import "./globals.scss";
import React from "react";
import ConditionalFooter from "@/components/conditional-footer/ConditionalFooter";
import ConditionalHeader from "@/components/conditional-header/ConditionaHeader";
import {usePathname} from "next/navigation";

export default function RootLayout({ children }: {children: React.ReactNode}) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const isUser = pathname.startsWith('/user')

    return (
        <html lang="fr">
          <body className={`${styles['app']} ${ isAdmin || isUser ? styles['active-administration'] : ''}`}>
          <ConditionalHeader className={styles['header']} />
            <main className={styles['main']}>
              {children}
            </main>
            <ConditionalFooter className={styles['footer']} />
          </body>
        </html>
    );
}
