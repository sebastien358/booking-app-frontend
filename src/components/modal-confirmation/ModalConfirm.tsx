import styles from './ModalConfirm.module.scss'

type ModalConfirmProps = {
    activeModal: boolean,
    closeModal: () => void,
    onClickDelete: () => void
}

export default function ModalConfirm({ activeModal, closeModal, onClickDelete }: ModalConfirmProps) {
    return (
        <>
            {activeModal && (
                <section className={styles['modal-overlay']}>
                    <div className={styles.modal}>
                        <div className={styles['modal__icon']}>🗑️</div>
                        <h2 className={styles['modal__title']}>Confirmer la suppression</h2>
                        <p className={styles['modal__text']}>
                            Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
                        </p>
                        <div className={styles['modal__actions']}>
                            <button onClick={() => closeModal()} className={`${styles['modal__btn']} ${styles['modal__btn--cancel']}`}>
                                Annuler
                            </button>
                            <button onClick={() => onClickDelete()} className={`${styles['modal__btn']} ${styles['modal__btn--confirm']}`}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}