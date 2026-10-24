'use client'

import Header from "@/components/header/Header";
import {usePathname} from "next/navigation";

export default function ConditionalHeader() {
    const pathname = usePathname()

    const isAdmin = pathname.startsWith('/admin')
    const isUser = pathname.startsWith('/user')

    if (isAdmin) return null
    if (isUser) return null

    return (
        <Header />
    )
}