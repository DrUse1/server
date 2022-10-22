import Axios from 'axios';
import { createSignal } from 'solid-js';
import { loading, setLoading, staticConst } from '../globalInfo';
import styles from '../styles/confirm.module.scss'
import { LogoFull } from './elements';

export default function Confirm() {

    const [state, setState] = createSignal(0)

    const urlParams = new URLSearchParams(window.location.search);
    setLoading(a => a + 1)
    Axios.post(staticConst.url + '/api/confirm', {
        email: urlParams.get('email'),
        confirm: urlParams.get('confirm')
    }).then(res => {
        setLoading(a => a - 1)
        setState(res.data)
    })

    document.getElementsByTagName('body')[0].classList.add(styles.body)

    return (
        <>
            <div className={styles.confirmPage}>
                <div className={styles.logo}>
                    <LogoFull color="darkerBlue" />
                </div>
                <div className={styles.confirmWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={state() === 0} >
                        <div>Un problème est survenu. Réessayes plus tard ou contactes le support</div>
                    </Show>
                    <Show when={state() === 1}>
                        <div>Votre email a bien été confirmé !</div>
                    </Show>
                    <Show when={state() === 2}>
                        <div>Votre email a déjà été confirmé !</div>
                    </Show>
                </div>
            </div>
        </>
    )
}
