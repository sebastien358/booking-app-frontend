'use client'
import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export const useScrollTop = (offset = 300) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY
            setShow(scroll >= offset)
        }

        window.addEventListener('scroll', handleScroll, {passive: true})
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [offset]);

    const scrollTop = useCallback(() => {
        gsap.to(window, {
            duration: 0.6,
            scrollTo: {y: 0},
            ease: 'power2.out'
        })
    }, [])

    return {
        show,
        scrollTop
    }
}