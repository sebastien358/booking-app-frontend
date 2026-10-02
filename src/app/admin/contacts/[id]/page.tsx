'use client'

import ContactDetails from "@/features/admin/views/contact/ContactDetails";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useContactAdminStore} from "@/store/admin/contactAdmin.store";

export default function Page() {
    const { contactDetails, currentContact, contactDelete, isLoading } = useContactAdminStore()

    const { id } = useParams<{ id: string }>()

    if (id) {
        useEffect(() => {
            contactDetails(id)
        }, [id, contactDetails]);
    }

    return (
        <ContactDetails
            id={id}
            currentContact={currentContact}
            contactDelete={contactDelete}
            isLoading={isLoading}
        />
    )
}