import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosStaffList} from "@/shared/services/staff.service";

interface StaffState {
    staffs: any[]
    isLoadingStaff: boolean

    staffList: () => Promise<void>
}

export const useStaffStore = create<StaffState>()(
    persist((set, get) => ({
            staffs: [],
            isLoadingStaff: false,

            staffList: async () => {
                set({ isLoadingStaff: true })
                try {
                    const data = await axiosStaffList()
                    set({ staffs: data, isLoadingStaff: false })
                } catch (err) {
                    set({ isLoadingStaff: false })
                    throw err
                }
            }

        }),
        {name: 'staff-state'}
    )
)