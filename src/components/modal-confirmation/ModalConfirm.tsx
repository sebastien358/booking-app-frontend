import styles from './ModalConfirm.module.scss'

type ModalConfirmProps = {
    activeModal: boolean
    closeModal: () => void
    onClickDelete: () => void
    dropdownAccount: boolean | null
    dropdownBookingUser: boolean | null
    errorMessage: string | null
}

export default function ModalConfirm({ activeModal, closeModal, onClickDelete, dropdownAccount, dropdownBookingUser, errorMessage }: ModalConfirmProps) {

    let textModal = ''
    let textButton = ''

    if (dropdownAccount) {
        textModal = 'Cette action est irréversible. Voulez-vous vraiment supprimer ce compte ?'
        textButton = 'Supprimer'
    } else if(dropdownBookingUser) {
        textModal = 'Cette action est irréversible. Voulez-vous vraiment annuler votre rendez-vous ?'
        textButton = 'Annuler'
    } else {
        textModal = 'Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?'
        textButton = 'Supprimer'
    }

    return (
        <main>
            {activeModal && (
                <section className={styles['modal-overlay']}>
                    <div className={styles.modal}>
                        <div className={styles['modal__icon']}>🗑️</div>
                        <h2 className={styles['modal__title']}>
                            Confirmer la suppression
                        </h2>
                        <p className={styles['modal__text']}>
                            {textModal}
                        </p>

                        <div className={styles['modal__actions']}>
                            <button
                                onClick={() => closeModal()}
                                className={`${styles['modal__btn']} ${styles['modal__btn--cancel']}`}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => onClickDelete()}
                                className={`${styles['modal__btn']} ${styles['modal__btn--confirm']}`}
                            >
                                {textButton}
                            </button>
                        </div>
                        {errorMessage && <p className={styles['error-message']}>
                            {errorMessage}
                        </p>}
                    </div>
                </section>
            )}
        </main>
    )
}