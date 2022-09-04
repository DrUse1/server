import { useNavigate } from '@solidjs/router';
import Axios from 'axios';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { loading, setLoading, showWarning, staticConst } from '../globalInfo';
import styles from '../styles/forgot.module.scss'

export default function Forgot() {
    const navigate = useNavigate()

    const [form, setForm] = createStore({
        email: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordVisibility, setPasswordVisibility] = createSignal('password')
    const [warning, setWarning] = createSignal('')
    const [response, setResponse] = createSignal(['', ''])
    const [state, setState] = createSignal(0)

    const requires = {
        'minLen': '8 caractères minimum',
        'upper': '1 majuscule',
        'lower': '1 minusclue',
        'number': '1 chiffre',
        'special': '1 caractère spécial'
    }

    const urlParams = new URLSearchParams(window.location.search);
    if ([...urlParams.keys()].length === 2) {
        setState(1)
    }

    function handleSubmit() {
        if (document.getElementById('emailInput').checkValidity()) {
            setLoading(a => a + 1)
            Axios.post(staticConst.url + '/api/forgot', {
                email: form.email,
                url: window.origin
            }).then(res => {
                setLoading(a => a - 1)
                if (res.data) {
                    setResponse(['green',
                        'Tu as bien un compte chez nous ! Nous allons t\'envoyer un mail avec un lien de réinitialisation du mot de passe !'
                    ])
                } else {
                    setResponse(['red',
                        'Tu n\'as pas de compte chez nous :( Créés-en un ou contactes le support !'
                    ])
                }
            })
        } else {
            showWarning('Le format de l\'email est incorrect !', 'red')
        }
    }

    function handleChange(value) {
        setForm('newPassword', value)
        const number = '0123456789'
        const special = '/*-+!:;,*$^#~&?.<>%£µ()[]{}°|@='
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        document.getElementsByClassName('minLen')[0].classList.remove(styles.valid)
        document.getElementsByClassName('upper')[0].classList.remove(styles.valid)
        document.getElementsByClassName('lower')[0].classList.remove(styles.valid)
        document.getElementsByClassName('special')[0].classList.remove(styles.valid)
        document.getElementsByClassName('number')[0].classList.remove(styles.valid)
        if (form.newPassword.length >= 8) {
            document.getElementsByClassName('minLen')[0].classList.add(styles.valid)
        }
        for (let i = 0; i < form.newPassword.length; i++) {
            if (number.includes(form.newPassword[i])) {
                document.getElementsByClassName('number')[0].classList.add(styles.valid)
            }
            if (upper.includes(form.newPassword[i])) {
                document.getElementsByClassName('upper')[0].classList.add(styles.valid)
            }
            if (lower.includes(form.newPassword[i])) {
                document.getElementsByClassName('lower')[0].classList.add(styles.valid)
            }
            if (special.includes(form.newPassword[i])) {
                document.getElementsByClassName('special')[0].classList.add(styles.valid)
            }
        }
    }

    function submitPassForm() {
        if (form.newPassword !== form.confirmPassword) {
            showWarning('Les mots de passes sont différents')
            return false
        }
        const elements = document.getElementsByClassName('requireItem')
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains(styles.valid)) {
                showWarning('Respectez les conditions du mot de passe')
                return false
            }
        }

        setLoading(a => a + 1)
        Axios.post(staticConst.url + '/api/forgot', {
            forgot: urlParams.get('forgot'),
            email: urlParams.get('email'),
            password: form.newPassword,
        }).then((res) => {
            setLoading(a => a - 1)
            if (res.data) {
                setState(2)
                setResponse(['green',
                    'Ton mot de passe a bien été modifié !'
                ])
            } else {
                setState(2)
                setResponse(['red',
                    'Une erreur est survenue. Réessaye plus tard ou contactes le support !'
                ])
            }
        })
    }

    document.getElementsByTagName('body')[0].classList.add(styles.body)

    return (
        <>
            <div className={styles.forgotPage}>
                <div className={styles.forgotWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <div className={styles.forgotTitle}>
                        <span>Mot de passe oublié</span>
                    </div>
                    <Show when={response()[1].length > 0}>
                        <div className={styles.forgotResponse + ' ' + styles[response()[0]]}>
                            <span>{response()[1]}</span>
                        </div>
                    </Show>
                    <Show when={state() === 0}>
                        <div className={styles.forgotForm}>
                            <div className={styles.forgotItem}>
                                <span>Email</span>
                                <input
                                    id="emailInput"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm('email', e.target.value)}
                                    required />
                            </div>
                            <button className={styles.button} onClick={() => handleSubmit()}>Confirmer</button>
                        </div>
                    </Show>
                    <Show when={state() === 1}>
                        <div className={styles.forgotForm}>
                            <div className={styles.forgotPassFormItem}>
                                <span>Nouveau Mot De Passe</span>
                                <div className={styles.passwordFieldWrapper}>
                                    <input
                                        type={passwordVisibility()}
                                        value={form.newPassword}
                                        onInput={(e) => { handleChange(e.target.value) }}
                                        required
                                        autocomplete="chrome-off" />
                                    <div className={styles.passwordIconWrapper}>
                                        <div className={styles.passwordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility(passwordVisibility() === 'password' ? 'text' : 'password') } }}>
                                            <Show when={passwordVisibility() === 'password'} fallback={
                                                <svg className={styles.passwordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <g fill="currentColor"><path d="M17.712 10.581c-.3.68-.686 1.373-1.167 2.03a1 1 0 101.615 1.18c.981-1.341 1.55-2.634 1.802-3.516a1 1 0 000-.55c-.283-.988-.927-2.413-2.05-3.842C16.015 3.468 13.394 2 10 2c-.96 0-1.869.12-2.722.353a1 1 0 10.526 1.93A8.317 8.317 0 0110 4c2.732 0 4.798 1.157 6.34 3.118A10.725 10.725 0 0117.947 10a9.75 9.75 0 01-.236.581zM2.334 9.318c.34-.75.78-1.503 1.328-2.2.452-.576.96-1.09 1.525-1.526A1 1 0 003.963 4.01a10.78 10.78 0 00-1.874 1.872C.966 7.312.322 8.736.04 9.725a1 1 0 000 .55c.283.989.927 2.413 2.05 3.843C3.986 16.532 6.608 18 10.001 18c2.253 0 4.194-.658 5.823-1.848a1 1 0 10-1.18-1.615C13.351 15.481 11.822 16 10.001 16c-2.732 0-4.798-1.157-6.339-3.118A10.725 10.725 0 012.053 10c.065-.18.158-.41.28-.682z"></path><path d="M11.414 11.414a2 2 0 01-2.83-2.827A1 1 0 107.173 7.17a4 4 0 105.657 5.657 1 1 0 00-1.415-1.414z"></path><path d="M.293 1.707l18 18a1 1 0 001.414-1.414l-18-18A1 1 0 10.293 1.707z"></path></g>
                                                </svg>
                                            }>
                                                <svg className={styles.passwordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <g fill="currentColor"><path d="M10 14a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"></path><path d="M2.053 10a10.725 10.725 0 001.609 2.882C5.201 14.842 7.267 16 10 16s4.798-1.157 6.339-3.118A10.725 10.725 0 0017.947 10a10.725 10.725 0 00-1.609-2.882C14.799 5.158 12.733 4 10 4S5.202 5.157 3.661 7.118A10.725 10.725 0 002.053 10zM.038 9.725c.283-.989.927-2.413 2.05-3.843C3.987 3.468 6.608 2 10 2s6.014 1.468 7.911 3.882c1.124 1.43 1.768 2.854 2.05 3.843a1 1 0 010 .55c-.282.989-.926 2.413-2.05 3.843C16.014 16.532 13.393 18 10 18s-6.014-1.468-7.911-3.882C.965 12.688.32 11.264.039 10.275a1 1 0 010-.55z"></path></g>
                                                </svg>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.forgotPassFormItem}>
                                <span>Confirmer Nouveau Mot De Passe</span>
                                <div className={styles.passwordFieldWrapper}>
                                    <input
                                        type={passwordVisibility()}
                                        value={form.confirmPassword}
                                        onChange={(e) => { setForm('confirmPassword', e.target.value) }}
                                        required
                                        autocomplete="chrome-off" />
                                </div>
                            </div>
                            <div className={styles.passRequires}>
                                <For each={Object.entries(requires)}>{([requireCode, requireValue]) =>
                                    <div className={styles.passRequireItemWrapper}>
                                        <div className={styles.passRequireItem + ' requireItem ' + requireCode}>
                                            <span>{requireValue}</span>
                                        </div>
                                    </div>
                                }</For>
                            </div>
                            <Show when={warning().length > 0}>
                                <br />
                                <span className={styles.warning}>{warning()}</span>
                            </Show>
                            <button className={styles.button} onClick={() => submitPassForm()}>Confirmer</button>
                        </div>
                    </Show>
                    <Show when={state() === 2 && response()[0] === 'green'}>
                        <button className={styles.button} style={{'align-self': 'center'}} onClick={() => navigate('/auth')}>Se connecter</button>
                    </Show>
                </div>
            </div>
        </>
    )
}
