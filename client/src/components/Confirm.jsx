import Axios from 'axios';
import { createSignal } from 'solid-js';
import { loading, setLoading, staticConst } from '../globalInfo';
import styles from '../styles/confirm.module.scss'

export default function Confirm() {

    const [render, setRender] = createSignal(false)

    const urlParams = new URLSearchParams(window.location.search);
    setLoading(a => a + 1)
    Axios.post(staticConst.url + '/api/confirm', {
        email: urlParams.get('email'),
        confirm: urlParams.get('confirm')
    }).then(res => {
        setLoading(a => a - 1)
        setRender(res.data)
    })

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
