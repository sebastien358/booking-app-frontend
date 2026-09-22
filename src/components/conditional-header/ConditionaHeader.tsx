'use client'

import Header from "@/components/header/Header";
import {usePathname} from "next/navigation";

export default function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) return null

    return (
        <Header />
    )
}