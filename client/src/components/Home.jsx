import { useNavigate } from "@solidjs/router";
import { loading, staticConst } from "../globalInfo";
import styles from '../styles/home.module.scss'

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.homeWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Bienvenue sur QCMed !</span>
                        </div>
                        <div className={styles.slogan}>
                            <span>Faire des QCM n'a jamais été aussi facile.</span>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Bienvenue sur QCMed !</span>
                        </div>
                        <div className={styles.slogan}>
                            <span>Faire des QCM n'a jamais été aussi facile.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
