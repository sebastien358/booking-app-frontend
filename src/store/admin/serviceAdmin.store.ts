import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminServiceDelete,
    axiosAdminServiceDetails,
    axiosAdminServiceList,
    axiosAdminServiceSearch
} from "@/shared/services/admin/serviceAdmin.service";

export interface CategoryData {
    id: number
    name: string
}

export interface ServiceData {
    id: number
    duration: number
    name: string
    price: string
    category: CategoryData
}

export interface ServiceState {
    services: ServiceData[]
    currentService: ServiceData | null
    isLoading: boolean
    offset: number
    limit: number
    term: string | null,
    countServices: null | number
    hasMore: boolean

    serviceList: () => Promise<void>
    serviceDetails: (id: string) => Promise<void>
    serviceSearch: (term: string | null) => Promise<void >
    serviceLazyLoad: () => Promise<void>
    serviceDelete: (id: string) => Promise<void>
    resetService: () => void
}

export const useServiceAdminStore = create<ServiceState>()(
    persist((set, get) => ({
        services: [],
        currentService: null,
        isLoading: false,
        offset: 0,
        limit: 4,
        term: null,
        countServices: null,
        hasMore: true,

        serviceList: async () => {
            try {
                set({
                    services: [],
                    isLoading: true,
                    offset: 0,
                    countServices: null,
                    hasMore: true
                })

                const data = await axiosAdminServiceList(get().offset, get().limit)

                set({
                    services: data.services,
                    isLoading: false,
                    countServices: data.count,
                    hasMore: data.services.length >= get().limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        serviceDetails: async (id: string) => {
            try {
                set({ currentService: null, isLoading: true })
                const data = await axiosAdminServiceDetails(id)
                set({ currentService: data, isLoading: false })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        serviceSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: null, offset: 0, isLoading: false, hasMore: true })
                    await get().serviceList()
                    return
                }

                set({ term: trimmed, isLoading: true, hasMore: true })
                const data = await axiosAdminServiceSearch(get().term)
                set({ services: data, isLoading: false , hasMore: false })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        serviceLazyLoad: async () => {
            try {
                const { services, isLoading, offset, limit, hasMore } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })
                const data = await axiosAdminServiceList(get().offset, get().limit)

                const newServices = data.services ?? data ?? []
                if (newServices.length === 0) {
                    set({ isLoading: false, hasMore: false })
                }

                set({
                    services: [ ...services, ...data.services ],
                    isLoading: false,
                    countServices: data.count,
                    hasMore: newServices.length >= limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        serviceDelete: async (id: string) => {
            const { services } = get()
            set({ services: services.filter((s) => s.id !== id) })
            try {
                await axiosAdminServiceDelete(id)
                set({ currentService: null })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        resetService: async () => {
            try {
                await get().serviceList()
                set({ term: null, offset: 0, hasMore: true })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        }

    }), {
        name: 'service-admin-state',
        partialize: (state) => ({
            services: state.services,
            offset: state.offset,
            hasMore: state.hasMore
        })
    })
)