import { loading, staticConst } from "../globalInfo"
import Footer from "./Footer";
import Header from "./Header"
import styles from "../styles/success.module.scss"
import { createSignal } from "solid-js";

export default function Success() {
    const [state, setState] = createSignal(false)

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') == 'true') {
        setState(true)
    }

    return (
        <>
            <Header />
            <div className={styles.successWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                <Show when={state()} fallback={
                    <>
                        <div className={styles.title}>
                            <span>Erreur</span>
                        </div>
                        <div className={styles.desc}>
                            <span>Un problème est survenu. Si tu as effectué le paiement, contactes le support !</span>
                        </div>
                    </>
                }>
                    <div className={styles.title}>
                        <span>Merci !</span>
                    </div>
                    <div className={styles.desc}>
                        <span>Le paiement a bien été effectué ! Tu peux maintenant faire autant de séries que tu le souhaites ! (Il est possible que le changement prenne quelques minutes avant de s'effectuer) </span>
                    </div>
                </Show>
            </div>
            <Footer style='header' />
        </>
    )
}
