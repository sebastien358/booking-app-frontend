"use client"

import ServiceDetails from "@/features/admin/views/service/ServiceDetails";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useServiceAdminStore} from "@/store/admin/serviceAdmin.store";

export default function Page() {

    const { id } = useParams<{id: string}>()

    const { serviceDetails, serviceDelete, currentService, isLoading  } = useServiceAdminStore()

    useEffect(() => {
        if (id) {
            serviceDetails(id)
        }

    }, [id, serviceDetails]);

    return (
        <ServiceDetails
            id={id}
            currentService={currentService}
            serviceDelete={serviceDelete}
            isLoading={isLoading}
        />
    )
}