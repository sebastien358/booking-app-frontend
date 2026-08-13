import Link from "next/link";
import styles from '@/templates/header/Header.module.scss'
import {usePathname} from "next/navigation";
import {ReactNode} from "react";

type NavLinkProps = {
    href: string
    children: ReactNode
    dropdown?: boolean
}

export default function NavLink({href, children, dropdown = false}: NavLinkProps) {
    const pathName = usePathname()
    const isActive = pathName === href

    let activeClass = ''

    if (dropdown) {
        activeClass = styles['active']
    }

    return (
        <Link href={href} className={`${isActive ? activeClass : ''}`}>
            {children}
        </Link>
    )
}