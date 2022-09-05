import styles from '../styles/footer.module.scss'

export default function Footer() {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.content}>
                <div className={styles.section}>
                    <button>
                        <span>Nous contacter</span>
                    </button>
                    <button>
                        <span>CGU</span>
                    </button>
                </div>
                <div className={styles.section}>
                    <button>
                        <span>QCMED</span>
                    </button>
                </div>
            </div>
            <div className={styles.copyright}>
                <span>© QCMED 2022 - tous droits réservés</span>
            </div>
        </div>
    )
}
