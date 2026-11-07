"use client"

import StaffDetails from "@/features/admin/views/staff/StaffDetails";
import {useParams} from "next/navigation";
import {useStaffAdminStore} from "@/store/admin/staffAdmin.store";
import {useEffect} from "react";

export default function Page() {
    const { id } = useParams<{id: string}>()

    const { staffDetails, staffDelete, staffDeleteImage, staffEdit, staffToggle, isLoading, currentStaff } = useStaffAdminStore()

    useEffect(() => {
        if (id) {
            staffDetails(id)
        }
    }, [id]);

    return (
        <StaffDetails
            id={id}
            staffDelete={staffDelete}
            staffDeleteImage={staffDeleteImage}
            staffEdit={staffEdit}
            staffToggle={staffToggle}
            isLoading={isLoading}
            currentStaff={currentStaff}
        />
    )
}