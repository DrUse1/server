import { useNavigate } from '@solidjs/router'
import styles from '../styles/footer.module.scss'
import { LogoFull } from './elements'

export default function Footer(props) {
    const navigate = useNavigate()
    return (
        <div className={styles.footerWrapper + (props.style === 'header' ? ' ' + styles.header : '')}>
            <div className={styles.content}>
                <div className={styles.section}>
                    <button onClick={() => navigate('/contact')}>
                        <span>Nous contacter</span>
                    </button>
                    <button onClick={() => navigate('/terms')}>
                        <span>CGU</span>
                    </button>
                </div>
                <div className={styles.section}>
                    <button onClick={() => window.location.href = '/'} className={styles.logo}>
                        <LogoFull />
                    </button>
                </div>
            </div>
            <div className={styles.copyright}>
                <span>© QCMED 2022 - tous droits réservés</span>
            </div>
        </div>
    )
}
