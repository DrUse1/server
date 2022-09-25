import { useNavigate } from "@solidjs/router";
import { loading, staticConst } from "../globalInfo";
import styles from '../styles/home.module.scss'
import Footer from "./Footer";

import Example1 from '../images/example1.png'
import Example2 from '../images/example2.png'
import { createSignal } from "solid-js";

export default function Home() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add(styles.show)
            } else {
                //entry.target.classList.remove(styles.show)
            }
        })
    });

    setTimeout(() => {
        const elements = document.querySelectorAll('.' + styles.box);
        elements.forEach(el => {
            observer.observe(el);
        });
    }, 100);

    const [areaValue, setAreaValue] = createSignal('')

    function formatArea() {
        function preferredOrder(obj, order) {
            var newObject = {};
            for (var i = 0; i < order.length; i++) {
                if (obj.hasOwnProperty(order[i])) {
                    newObject[order[i]] = obj[order[i]];
                }
            }
            return newObject;
        }

        let splitQCM = areaValue().split('QCM')
        let _temp = []
        splitQCM.forEach(e => {
            if (e !== '') {
                _temp = [..._temp, e.slice((e[5] === ' ' ? 6 : 5))]
            }
        })
        splitQCM = _temp
        _temp = []
        const letters = 'EDCBA'
        splitQCM.forEach(e => {
            let obj = {}
            for (let i = 0; i < 5; i++) {
                e = e.split(letters[i] + ') ')
                obj['answer' + (4 - i)] = e[1]
                e = e[0]
            }
            obj['question'] = e
            obj = preferredOrder(obj, ['question','answer0','answer1','answer2','answer3','answer4'])
            _temp = [..._temp, obj]
        })
        splitQCM = _temp
        _temp = []
        console.log(splitQCM)
    }

    return (
        <>
            <div className={styles.homeWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.section}>
                    <div className={styles.container}>
                        {/* <textarea value={areaValue()} onChange={(e) => setAreaValue(e.target.value.replaceAll('\n', ''))} />
                        <button onClick={() => formatArea()}>submit</button> */}
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
                    <div className={styles.container}>
                        <div className={styles.arrow}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>Nos services</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Notre site permets à tous les étudiants de médecine de France
                                    (et d'ailleurs) de s'entrainer à l'aide de QCM personnalisables
                                    et recouvrant tout le programme de première année !
                                </span>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>+ de 1000 questions !</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Les questions sont continuellement mises à jour et de
                                    nombreuses sont rajoutées chaque jour !
                                    Elles sont rigoureusement choisies et vérifiées pour le
                                    meilleur entraînement possible !
                                </span>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.title}>
                                <span>À venir !</span>
                            </div>
                            <div className={styles.text}>
                                <span>
                                    Le site est en constante évolution. De nombreuses
                                    fonctionnalitées sont encore à venir donc n'hésites
                                    pas à rejoindre dès maintenant !
                                </span>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.img}>
                                <img src={Example1} alt="example 1" />
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.img}>
                                <img src={Example2} alt="example 2" />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
