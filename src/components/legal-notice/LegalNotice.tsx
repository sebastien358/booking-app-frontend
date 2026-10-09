"use client"

import styles from './LegalNotice.module.scss'

type LegalNoticeProps = {
    openModalLegal: boolean,
    closeModalLegal: () => void
}

export default function LegalNotice({ openModalLegal, closeModalLegal }: LegalNoticeProps) {
    return (
        <main>
            {openModalLegal && (
                <div className={styles['legal-overlay']}>
                    <div className={styles['legal-modal']}>
                        <button onClick={() => closeModalLegal()} className={styles['legal-modal__close']}>✕</button>
                        <div className={styles['legal-modal__header']}>
                            <h1>Mentions légales</h1>
                            <div className={styles['legal-modal__line']}></div>
                        </div>
                        <div className={styles['legal-modal__content']}>
                            <section className={styles['legal-section']}>
                                <h2>Éditeur du site</h2>
                                <p><strong>Nom :</strong> Sébastien Petit</p>
                                <p><strong>Statut :</strong> Entrepreneur individuel</p>
                                <p><strong>Email :</strong> sebastienpetit27330@gmail.com</p>
                            </section>
                            <section className={styles['legal-section']}>
                                <h2>Hébergement</h2>
                                <p><strong>Hébergeur :</strong> O2Switch</p>
                                <p>
                                    <strong>Adresse :</strong> 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand
                                </p>
                                <p>
                                    <strong>Site :</strong>{' '}
                                    <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer">
                                        www.o2switch.fr
                                    </a>
                                </p>
                            </section>
                            <section className={styles['legal-section']}>
                                <h2>Propriété intellectuelle</h2>
                                <p>
                                    L'ensemble des contenus du site (textes, images, logo, graphismes, code source) est
                                    protégé par le droit d'auteur. Toute reproduction sans autorisation expresse est
                                    strictement interdite.
                                </p>
                            </section>
                            <section className={styles['legal-section']}>
                                <h2>Données personnelles</h2>
                                <p>
                                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
                                    suppression de vos données personnelles. Contactez-nous à :{' '}
                                    <strong>sebastienpetit27330@gmail.com</strong>
                                </p>
                                <p>
                                    Les données collectées (email, adresse) sont utilisées uniquement pour le traitement
                                    de vos commandes et ne sont jamais transmises à des tiers.
                                </p>
                            </section>
                            <section className={styles['legal-section']}>
                                <h2>Cookies</h2>
                                <p>
                                    Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement
                                    (authentification, panier). Aucun cookie publicitaire ou de tracking n'est utilisé.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}