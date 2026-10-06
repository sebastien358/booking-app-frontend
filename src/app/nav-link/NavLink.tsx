import Link from "next/link";
import styleSidebar from "@/features/admin/components/Sidebar.module.scss"
import styles from '@/components/header/Header.module.scss'
import {usePathname} from "next/navigation";

type NavLinkProps = {
    href: string
    children: string
    dropdown: boolean | null
    dropdownSidebar: boolean | null
}

export default function NavLink({ href, children, dropdown = false, dropdownSidebar = false }: NavLinkProps) {
    const pathName = usePathname()
    const isActive = pathName === href

    let activeClass = ''

    if (dropdown) {
        activeClass = styles['active']
    } else if (dropdownSidebar) {
        activeClass = styleSidebar['active']
    }

    return (
        <Link href={href} className={`${isActive ? activeClass : ''}`}>
            {children}
        </Link>
    )
}