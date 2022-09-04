import { loading, setLoading, staticConst } from '../globalInfo';
import styles from '../styles/forgot.module.scss'

export default function Forgot() {

    document.getElementsByTagName('body')[0].classList.add(styles.body)

    return (
        <>
            <div className={styles.confirmPage}>
                <div className={styles.confirmWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={render()} fallback={
                        <div>Un problème est survenue. Réessayez plus tard ou contacter le support</div>
                    }>
                        <div>Votre mail a bien été confirmé !</div>
                    </Show>
                </div>
            </div>
        </>
    )
}
