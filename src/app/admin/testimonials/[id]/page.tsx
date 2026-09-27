'use client'

import TestimonialDetails from "@/features/admin/views/testimonials/TestimonialDetails";
import {useParams} from "next/navigation";
import {useTestimonialAdminStore} from "@/store/admin/testimonialAdmin.store";
import {useEffect} from "react";

export default function Page() {
    const { testimonialAdminDetails, testimonialAdminToggle, currentTestimonial, isLoading } = useTestimonialAdminStore()

    const { id } = useParams<{id: string}>()

    useEffect(() => {
        if (id) {
            testimonialAdminDetails(id)
        }
    }, [testimonialAdminDetails, id]);

    return (
        <TestimonialDetails
            id={id}
            testimonialAdminToggle={testimonialAdminToggle}
            currentTestimonial={currentTestimonial}
            isLoading={isLoading}
        />
    )
}