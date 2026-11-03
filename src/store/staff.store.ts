import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosStaffList} from "@/shared/services/staff.service";

export interface StaffData {
    id: number
    firstname: string
    lastname: string
    picture: {
        filename: string | null
    }
}

export interface StaffState {
    staffs: StaffData[]
    isLoadingStaff: boolean

    staffList: () => Promise<void>
}

export const useStaffStore = create<StaffState>()(
    persist((set, get) => ({
        staffs: [],
        isLoadingStaff: false,

        staffList: async () => {
            try {
                set({ isLoadingStaff: true })
                const data = await axiosStaffList()
                set({ staffs: data, isLoadingStaff: false })

                console.log(get().staffs)
            } catch (err) {
                set({ isLoadingStaff: false })
                throw err
            }
        }

    }), {
        name: 'staff-state',
        partialize: (state) => ({
            staffs: state.staffs
        })
    })
)