import { useNavigate } from "@solidjs/router";
import { loading, staticConst } from "../globalInfo";
import styles from '../styles/home.module.scss'

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div onscroll={(e) => console.log(e)} className={styles.homeWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Bienvenue sur QCMed !</span>
                        </div>
                        <div className={styles.slogan}>
                            <span>Faire des QCM n'a jamais été aussi facile.</span>
                        </div>
                        <button className={styles.start} onClick={() => window.location.href = '/auth'}>
                            <span>Commencer maintenant !</span>
                        </button>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>Bienvenue sur QCMed !</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis harum ratione cum impedit accusamus dolor officiis atque iusto ipsam exercitationem.
                                </span>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>Bienvenue sur QCMed !</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, labore? Iure aliquam, nisi voluptates nostrum, numquam necessitatibus, placeat soluta magni neque repellendus labore pariatur ullam reprehenderit aspernatur. Eius, voluptatibus enim?
                                </span>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>Bienvenue sur QCMed !</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, obcaecati error expedita, animi cupiditate nemo quidem quae corrupti repellendus magnam dolore, eligendi unde nulla atque labore officia ipsa placeat nihil sequi quos consectetur est maxime dolorum odio. Hic, modi enim.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
