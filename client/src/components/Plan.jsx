import Header from "./Header";

import styles from "../styles/plan.module.scss"
import { global, loading, setLoading, showWarning, staticConst, userInfo } from "../globalInfo";
import Axios from "axios";
import Footer from "./Footer";

function handleClick(plan) {
    if (userInfo.plan === 'premium') {
        showWarning('Tu as déjà le plan premium')
        return
    }
    setLoading(a => a + 1)
    Axios.post(staticConst.url + "/create-checkout-session", {
        lookup_key: plan,
        email: userInfo.email,
        url: window.location.origin,
        token: userInfo.token
    }).then((res) => {
        setLoading(a => a - 1)
        if (res.data === 'confirm') {
            showWarning('Tu dois confirmer ton mail si tu veux prendre ce plan. Tu viens de recevoir un mail de confirmation !')
        } else if (res.data === false) {
            window.location.reload()
        } else {
            window.location.replace(res.data)
        }
    })
}

export default function Plan() {
    return (
        <>
            <Header />
            <div className={styles.planWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : '') }}>
                <div>
                    <h2>Rien de plus simple !</h2>
                </div>
                <div className={styles.planContent}>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            <span>Basic</span>
                            <Show when={userInfo.plan === 'basic'}>
                                <span> (plan actuel)</span>
                            </Show>
                        </div>
                        <div className={styles.description}>
                            <span>
                                Le plan de base qui te permet de prendre en main et
                                tester l'application. Avec ce plan tu es limité à 
                                {global.dailyLimit} séries de QCM par jour.
                            </span>
                        </div>
                        <div className={styles.price}>
                            <span>€</span>
                            <span>0</span>
                            <span>/mois</span>
                        </div>
                    </div>
                    <div className={styles.item} onClick={() => handleClick('premium')}>
                        <div className={styles.title}>
                            <span>Premium</span>
                            <Show when={userInfo.plan === 'premium'}>
                                <span> (plan actuel)</span>
                            </Show>
                        </div>
                        <div className={styles.description}>
                            <span>
                                Ce plan contient autant de fontionnalité que le Basic,
                                seulement le plus important change : tu n'es plus limité
                                à {global.dailyLimit} séries par jour mais à... bah tu n'es plus limité en fait !
                            </span>
                        </div>
                        <div className={styles.price}>
                            <span>€</span>
                            <span>5</span>
                            <span>/mois</span>
                        </div>
                        <div className={styles.subPrice}>
                            <span>
                                Abonnement sans engagement !
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer style='header' />
        </>
    )
}
