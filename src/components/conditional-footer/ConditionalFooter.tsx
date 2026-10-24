"use client"

import Footer from "@/components/footer/Footer";
import {usePathname} from "next/navigation";

export default function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const isUser = pathname.startsWith('/user')

    if (isAdmin) return null
    if (isUser) return null

    return (
        <Footer />
    )
}