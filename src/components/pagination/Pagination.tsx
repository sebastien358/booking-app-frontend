import styles from './Pagination.module.scss'

type PaginationProps = {
    currentPage: number,
    pages: number,
    previousPage: () => void,
    nextPage: () => void
}

export default function Pagination({ currentPage, pages, previousPage, nextPage }: PaginationProps) {

    return (
        <section className={`${styles['pagination']} ${pages > 1 ? styles['active'] : ''}`}>
            <button
                onClick={() => previousPage()}
                disabled={currentPage === 1}
                className={`${styles['btn-pagination']} ${currentPage === 1 ? styles['disabled'] : ''}`}
                aria-label="Page précédente"
            >
                Précédent
            </button>
            <span>{currentPage} - {pages}</span>
            <button
                onClick={() => nextPage()}
                disabled={currentPage === pages}
                className={`${styles['btn-pagination']} ${currentPage === pages ? styles['disabled'] : ''}`}
                aria-label="Page suivante"
            >
                Suivant
            </button>
        </section>
    )
}
