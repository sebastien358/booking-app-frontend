'use client'

import ResetPassword from "@/features/well-being/components/reset-password/ResetPassword";
import {useParams} from "next/navigation";

export default function Page() {

    const { token } = useParams<{token: string}>()

    return <ResetPassword token={token} />
}