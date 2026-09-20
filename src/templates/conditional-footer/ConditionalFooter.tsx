"use client"

import Footer from "@/templates/footer/Footer";
import {usePathname} from "next/navigation";

export default function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) return null

    return (
        <Footer />
    )
}