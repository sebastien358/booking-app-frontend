import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminStaffDelete, axiosAdminStaffDeleteImage, axiosAdminStaffDetails, axiosAdminStaffEdit,
    axiosAdminStaffList,
    axiosAdminStaffNew,
    axiosAdminStaffToggle
} from "@/shared/services/admin/staffAdmin.service";
import {useStaffStore} from "@/store/staff.store";

export interface StaffFormData {
    firstname: string
    lastname: string
    picture: string | null
}

export interface StaffData {
    id: number
    firstname: string
    lastname: string
    created_at: string
    is_active: boolean
    picture: { filename: string }
}

export interface StaffAdminState {
    staffs: StaffData[]
    currentStaff: StaffData | null
    isLoading: boolean
    offset: number
    limit: number
    term: string | null
    successMessage: string | null
    errorMessage: string | null
    hasMore: boolean

    staffsList: () => Promise<void>
    staffDetails: (id: string) => Promise<void>
    staffLazyLoad: () => Promise<void>
    staffSearch: (term: string) => Promise<void>
    staffForm: (data: StaffFormData) => Promise<void>
    staffEdit: (id: string, newFile: File) => Promise<void>
    staffDelete: (id: string) => Promise<void>
    staffDeleteImage: (id: string) => Promise<void>
    staffToggle: (id: string) => Promise<void>
    resetSuccessMessage: () => void
    resetErrorMessage: () => void
}

export const useStaffAdminStore = create<StaffAdminState>()(
    persist((set, get) => ({
        staffs: [],
        currentStaff: null,
        isLoading: true,
        offset: 0,
        limit: 3,
        term: null,
        successMessage: null,
        errorMessage: null,
        hasMore: true,

        staffsList: async () => {
            try {
                set({ staffs: [], isLoading: true, offset: 0, hasMore: true })
                const data = await axiosAdminStaffList(get().offset, get().limit)
                set({ staffs: data.staffs, isLoading: false, hasMore: data.staffs.length >= get().limit })
            } catch (err: any) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        staffDetails: async (id: string) => {
            try {
                set({ currentStaff: null, isLoading: true })
                const data = await axiosAdminStaffDetails(id)
                set({ currentStaff: data, isLoading: false })
            } catch (err: any) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        staffLazyLoad: async () => {
            try {
                const { staffs, hasMore, isLoading, offset, limit } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })
                const data = await axiosAdminStaffList(get().offset, get().limit)

                const newStaffs = data.staffs ?? []
                if (newStaffs.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    staffs: [ ...staffs, ...newStaffs ],
                    isLoading: false,
                    hasMore: newStaffs.length >= limit
                })
            } catch (err: any) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        staffSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim()
            console.log(trimmed)
            try {

            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        staffForm: async (data: StaffFormData) => {
            try {
                const formData = new FormData
                formData.append('firstname', data.firstname)
                formData.append('lastname', data.lastname)
                if (data?.picture) {
                    formData.append('picture', data.picture)
                }
                const result = await axiosAdminStaffNew(formData)
                set({ staffs: result, successMessage: 'Le salarié a été ajouté', isLoading: false })
            } catch (err: any) {
                console.error(err)
                set({ isLoading: false, errorMessage: 'Le salarié n\'a pas été ajouté' })
                throw err
            }
        },

        staffEdit: async (id: string, newFile: File) => {
            try {
                const formData = new FormData
                if (newFile instanceof File) {
                    formData.append('picture', newFile)
                }
                await axiosAdminStaffEdit(id, formData)
                await get().staffDetails(id)
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        staffDelete: async (id: string) => {
            try {
                await axiosAdminStaffDelete(id)
                set((state) => ({
                    staffs: state.staffs.filter((s) => s.id !== id)
                }))
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        staffDeleteImage: async (id: string) => {
            try {
                await axiosAdminStaffDeleteImage(id)
                await get().staffDetails(id)
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        staffToggle: async (id: string) => {
            try {
                await axiosAdminStaffToggle(id)
                await get().staffDetails(id)
                await useStaffStore.getState().staffList()
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        resetSuccessMessage: () => set({ successMessage: null }),

        resetErrorMessage: () => set({ errorMessage: null })

    }), {
        name: 'staff-admin-state',
        partialize: (state) => ({
            staffs: state.staffs
        })
    })
)