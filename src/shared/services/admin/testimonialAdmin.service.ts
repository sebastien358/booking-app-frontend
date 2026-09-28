import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminTestimonialList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonial/list`, {
            params: { offset, limit }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des témoignages : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminTestimonialSearch(term: string | null) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonial/search`, {
            params: { search: term}
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un témoignage - (search) : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminTestimonialDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/testimonial/show/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un témoignage : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminTestimonialToggle(id: string) {
    try {
        const response = await axios.put(`${BASE_URL}/api/admin/testimonial/${id}/toggle`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un témoignage : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminTestimonialDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/testimonial/${id}/delete`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un témoignage : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}