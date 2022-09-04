import { createEffect, createSignal, useContext } from "solid-js"
import Axios from 'axios'
import * as utils from '../utils'
import { staticConst, global, setGlobal, resetGlobal, showWarning, loading, setLoading } from '../globalInfo'

import styles from '../styles/auth.module.scss'
import { useNavigate } from "@solidjs/router"

export default function Auth() {
    const navigate = useNavigate()

    const [userForm, setUserForm] = createSignal({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
        prenom: '',
        phone: ''
    })
    const [passwordVisibility, setPasswordVisibility] = createSignal('password')
    const [loginWhenRegister, setLoginWhenRegister] = createSignal(false)

    function handleChange(name, value, opt) {
        setUserForm(prev => ({ ...prev, [name]: value }));
        const number = '0123456789'
        const special = '/*-+!:;,*$^#~&?.<>%£µ()[]{}°|@='
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        if (opt === 'requires') {
            document.getElementsByClassName('minLen')[0].classList.remove(styles.valid)
            document.getElementsByClassName('upper')[0].classList.remove(styles.valid)
            document.getElementsByClassName('lower')[0].classList.remove(styles.valid)
            document.getElementsByClassName('special')[0].classList.remove(styles.valid)
            document.getElementsByClassName('number')[0].classList.remove(styles.valid)
            if (userForm().password.length >= 8) {
                document.getElementsByClassName('minLen')[0].classList.add(styles.valid)
            }
            for (let i = 0; i < userForm().password.length; i++) {
                if (number.includes(userForm().password[i])) {
                    document.getElementsByClassName('number')[0].classList.add(styles.valid)
                }
                if (upper.includes(userForm().password[i])) {
                    document.getElementsByClassName('upper')[0].classList.add(styles.valid)
                }
                if (lower.includes(userForm().password[i])) {
                    document.getElementsByClassName('lower')[0].classList.add(styles.valid)
                }
                if (special.includes(userForm().password[i])) {
                    document.getElementsByClassName('special')[0].classList.add(styles.valid)
                }
            }
        }
    }

    function printDDB() {
        setLoading(a => a + 1)
        Axios.get(staticConst.url + '/api/get').then((res) => {
            console.log(res.data)
            setLoading(a => a - 1)
        })
    }

    function verifyForm() {
        if (userForm().password !== userForm().confirmPassword) {
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
        return true
    }

    function handleSubmit(type) {
        if (type === 'register') {
            if (verifyForm()) {
                setLoading(a => a + 1)
                Axios.get(staticConst.url + '/api/verify', {
                    params: {
                        email: userForm().email,
                        password: userForm().password
                    }
                }).then((res) => {
                    setLoading(a => a - 1)
                    if (!res.data[0]) {
                        const token = utils.getRandomToken()
                        setLoading(a => a + 1)
                        Axios.post(staticConst.url + '/api/insert', {
                            email: userForm().email,
                            password: userForm().password,
                            nom: userForm().nom,
                            prenom: userForm().prenom,
                            phone: userForm().phone,
                            token: token,
                            url: window.location.origin
                        }).then((res) => {
                            setLoading(a => a - 1)
                            if(res.data){
                                window.location.reload()
                            }else{
                                showWarning('Une erreur est servenue. Réessayez plus tard.')
                            }
                        })
                        if (loginWhenRegister()) {
                            localStorage.setItem(staticConst.LOCAL_SESSION_KEY, token)
                        }
                    } else {
                        showWarning('Un compte utilise déjà ce mail')
                    }
                    setLoading(a => a - 1)
                })
            }
        } else if (type === 'login') {
            setLoading(a => a + 1)
            Axios.get(staticConst.url + '/api/verify', {
                params: {
                    email: userForm().email,
                    password: userForm().password
                }
            }).then((res) => {
                if (res.data[0] === false) {
                    showWarning("Il n'y a pas de compte avec ce mail")
                } else {
                    if (res.data[1] === false) {
                        showWarning('Mot de passe incorrect')
                    } else {
                        const token = utils.getRandomToken()
                        setLoading(a => a + 1)
                        Axios.post(staticConst.url + '/api/update', {
                            prev_token: res.data[2],
                            token: token
                        }).then((res) => {
                            if (res.data) {
                                localStorage.setItem(staticConst.LOCAL_SESSION_KEY, JSON.stringify(token))
                                window.location.replace('/')
                            } else {
                                showWarning('Erreur. Réessayes plus tard')
                            }
                            setLoading(a => a - 1)
                        })
                    }
                }
                setLoading(a => a - 1)
            })
        }
    }

    function clearDDB() {
        setLoading(a => a + 1)
        Axios.post(staticConst.url + '/api/clear',).then((res) => {
            console.log(res.data)
            setLoading(a => a - 1)
        })
    }

    function resetForm() {
        setUserForm({
            email: '',
            password: '',
            confirmPassword: '',
            nom: '',
            prenom: '',
            phone: ''
        })
        setLoginWhenRegister(false)
        setPasswordVisibility('password')
    }

    function DisplayLogin() {
        return (
            <>
                <div className={styles.authTitle}>
                    <h2>Je me connecte</h2>
                </div>
                <form className={styles.authForm} onSubmit={async (e) => { e.preventDefault(true); handleSubmit('login') }}>
                    <span className={styles.authItem}>
                        <p>Email</p>
                        <div className={styles.authFieldWrapper}>
                            <input
                                autofocus
                                className={styles.authField}
                                type="email"
                                value={userForm().email}
                                onChange={(e) => { handleChange('email', e.target.value) }}
                                placeholder="jean@gmail.com"
                                required />
                        </div>
                    </span>
                    <span className={styles.authItem}>
                        <p>Mot de passe</p>
                        <div className={styles.authPasswordFieldWrapper}>
                            <input
                                className={styles.authField}
                                type={passwordVisibility()}
                                value={userForm().password}
                                onChange={(e) => { handleChange('password', e.target.value) }}
                                required />
                            <div className={styles.authPasswordIconWrapper}>
                                <div className={styles.authPasswordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility(passwordVisibility() === 'password' ? 'text' : 'password') } }}>
                                    <Show when={passwordVisibility() === 'password'} fallback={
                                        <svg className={styles.authPasswordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <g fill="currentColor"><path d="M17.712 10.581c-.3.68-.686 1.373-1.167 2.03a1 1 0 101.615 1.18c.981-1.341 1.55-2.634 1.802-3.516a1 1 0 000-.55c-.283-.988-.927-2.413-2.05-3.842C16.015 3.468 13.394 2 10 2c-.96 0-1.869.12-2.722.353a1 1 0 10.526 1.93A8.317 8.317 0 0110 4c2.732 0 4.798 1.157 6.34 3.118A10.725 10.725 0 0117.947 10a9.75 9.75 0 01-.236.581zM2.334 9.318c.34-.75.78-1.503 1.328-2.2.452-.576.96-1.09 1.525-1.526A1 1 0 003.963 4.01a10.78 10.78 0 00-1.874 1.872C.966 7.312.322 8.736.04 9.725a1 1 0 000 .55c.283.989.927 2.413 2.05 3.843C3.986 16.532 6.608 18 10.001 18c2.253 0 4.194-.658 5.823-1.848a1 1 0 10-1.18-1.615C13.351 15.481 11.822 16 10.001 16c-2.732 0-4.798-1.157-6.339-3.118A10.725 10.725 0 012.053 10c.065-.18.158-.41.28-.682z"></path><path d="M11.414 11.414a2 2 0 01-2.83-2.827A1 1 0 107.173 7.17a4 4 0 105.657 5.657 1 1 0 00-1.415-1.414z"></path><path d="M.293 1.707l18 18a1 1 0 001.414-1.414l-18-18A1 1 0 10.293 1.707z"></path></g>
                                        </svg>
                                    }>
                                        <svg className={styles.authPasswordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <g fill="currentColor"><path d="M10 14a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"></path><path d="M2.053 10a10.725 10.725 0 001.609 2.882C5.201 14.842 7.267 16 10 16s4.798-1.157 6.339-3.118A10.725 10.725 0 0017.947 10a10.725 10.725 0 00-1.609-2.882C14.799 5.158 12.733 4 10 4S5.202 5.157 3.661 7.118A10.725 10.725 0 002.053 10zM.038 9.725c.283-.989.927-2.413 2.05-3.843C3.987 3.468 6.608 2 10 2s6.014 1.468 7.911 3.882c1.124 1.43 1.768 2.854 2.05 3.843a1 1 0 010 .55c-.282.989-.926 2.413-2.05 3.843C16.014 16.532 13.393 18 10 18s-6.014-1.468-7.911-3.882C.965 12.688.32 11.264.039 10.275a1 1 0 010-.55z"></path></g>
                                        </svg>
                                    </Show>
                                </div>
                            </div>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot')}}>Mot de passe oublié ?</a>
                    </span>
                    <div className={styles.authSubmit}>
                        <button type="submit">
                            <div className={styles.authSubmitSpan}>
                                <span>Je me connecte</span>
                            </div>
                        </button>
                    </div>
                </form>
                <p>Vous n'avez pas de compte ?</p>
                <a href="#" onClick={(e) => { e.preventDefault(); resetForm(); setGlobal('state', 'register') }}>Inscrivez-vous !</a>
                <br />
                <button onClick={() => printDDB()}>Print database</button>
                <br />
                <button onClick={() => clearDDB()}>Clear database</button>
            </>
        )
    }

    const requires = {
        'minLen': '8 caractères minimum',
        'upper': '1 majuscule',
        'lower': '1 minusclue',
        'number': '1 chiffre',
        'special': '1 caractère spécial'
    }

    function DisplayRegister() {
        return (
            <>
                <div className={styles.authTitle}>
                    <h2>Je m'inscris</h2>
                </div>
                <form className={styles.authForm} onSubmit={async (e) => { e.preventDefault(true); handleSubmit('register') }}>
                    <span className={styles.authItem}>
                        <p>Prénom</p>
                        <input
                            className={styles.authField}
                            type="text"
                            value={userForm().prenom}
                            onChange={(e) => { handleChange('prenom', e.target.value) }}
                            required />
                    </span>
                    <span className={styles.authItem}>
                        <p>Nom</p>
                        <input
                            className={styles.authField}
                            type="text"
                            value={userForm().nom}
                            onChange={(e) => { handleChange('nom', e.target.value) }}
                            required />
                    </span>
                    <span className={styles.authItem}>
                        <p>Numéro de téléphone</p>
                        <input
                            className={styles.authField}
                            type="tel"
                            value={userForm().phone}
                            onChange={(e) => { handleChange('phone', e.target.value) }}
                            required />
                    </span>
                    <span className={styles.authItem}>
                        <p>Email</p>
                        <input
                            autofocus
                            className={styles.authField}
                            type="email"
                            value={userForm().email}
                            onChange={(e) => { handleChange('email', e.target.value) }}
                            placeholder="jean@gmail.com"
                            required />
                    </span>
                    <span className={styles.authItem}>
                        <p>Mot de passe</p>
                        <div className={styles.authPasswordFieldWrapper}>
                            <input
                                className={styles.authField}
                                type={passwordVisibility()}
                                value={userForm().password}
                                onInput={(e) => { handleChange('password', e.target.value, 'requires') }}
                                required />
                            <div className={styles.authPasswordIconWrapper}>
                                <div className={styles.authPasswordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility(passwordVisibility() === 'password' ? 'text' : 'password') } }}>
                                    <Show when={passwordVisibility() === 'password'} fallback={
                                        <svg className={styles.authPasswordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <g fill="currentColor"><path d="M17.712 10.581c-.3.68-.686 1.373-1.167 2.03a1 1 0 101.615 1.18c.981-1.341 1.55-2.634 1.802-3.516a1 1 0 000-.55c-.283-.988-.927-2.413-2.05-3.842C16.015 3.468 13.394 2 10 2c-.96 0-1.869.12-2.722.353a1 1 0 10.526 1.93A8.317 8.317 0 0110 4c2.732 0 4.798 1.157 6.34 3.118A10.725 10.725 0 0117.947 10a9.75 9.75 0 01-.236.581zM2.334 9.318c.34-.75.78-1.503 1.328-2.2.452-.576.96-1.09 1.525-1.526A1 1 0 003.963 4.01a10.78 10.78 0 00-1.874 1.872C.966 7.312.322 8.736.04 9.725a1 1 0 000 .55c.283.989.927 2.413 2.05 3.843C3.986 16.532 6.608 18 10.001 18c2.253 0 4.194-.658 5.823-1.848a1 1 0 10-1.18-1.615C13.351 15.481 11.822 16 10.001 16c-2.732 0-4.798-1.157-6.339-3.118A10.725 10.725 0 012.053 10c.065-.18.158-.41.28-.682z"></path><path d="M11.414 11.414a2 2 0 01-2.83-2.827A1 1 0 107.173 7.17a4 4 0 105.657 5.657 1 1 0 00-1.415-1.414z"></path><path d="M.293 1.707l18 18a1 1 0 001.414-1.414l-18-18A1 1 0 10.293 1.707z"></path></g>
                                        </svg>
                                    }>
                                        <svg className={styles.authPasswordIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <g fill="currentColor"><path d="M10 14a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"></path><path d="M2.053 10a10.725 10.725 0 001.609 2.882C5.201 14.842 7.267 16 10 16s4.798-1.157 6.339-3.118A10.725 10.725 0 0017.947 10a10.725 10.725 0 00-1.609-2.882C14.799 5.158 12.733 4 10 4S5.202 5.157 3.661 7.118A10.725 10.725 0 002.053 10zM.038 9.725c.283-.989.927-2.413 2.05-3.843C3.987 3.468 6.608 2 10 2s6.014 1.468 7.911 3.882c1.124 1.43 1.768 2.854 2.05 3.843a1 1 0 010 .55c-.282.989-.926 2.413-2.05 3.843C16.014 16.532 13.393 18 10 18s-6.014-1.468-7.911-3.882C.965 12.688.32 11.264.039 10.275a1 1 0 010-.55z"></path></g>
                                        </svg>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </span>
                    <span className={styles.authItem}>
                        <p>Confirmer le mot de passe</p>
                        <input
                            className={styles.authField}
                            type={passwordVisibility()}
                            value={userForm().confirmPassword}
                            onChange={(e) => { handleChange('confirmPassword', e.target.value) }}
                            required />
                    </span>
                    <div className={styles.authRequires}>
                        <For each={Object.entries(requires)}>{([requireCode, requireValue]) =>
                            <div className={styles.authRequireItemWrapper}>
                                <div className={styles.authRequireItem + ' requireItem ' + requireCode}>
                                    <span>{requireValue}</span>
                                </div>
                            </div>
                        }</For>
                    </div>
                    <span className={styles.authItem}>
                        <input
                            type="checkbox"
                            checked={loginWhenRegister()}
                            onChange={() => setLoginWhenRegister(prev => !prev)} />
                        Se connecter avec ces identifiants
                    </span>
                    <div className={styles.authSubmit}>
                        <button type="submit">
                            <div className={styles.authSubmitSpan}>
                                <span>Je m'inscris</span>
                            </div>
                        </button>
                    </div>
                </form>
                <p>Vous avez déjà un compte ?</p>
                <a href="#" onClick={(e) => { e.preventDefault(); resetForm(); setGlobal('state', 'login') }}>Connectez-vous !</a>
                <br />
                <button onClick={() => printDDB()}>Print database</button>
                <br />
                <button onClick={() => clearDDB()}>Clear database</button>
            </>
        )
    }

    document.getElementsByTagName('body')[0].classList.add(styles.body)

    return (
        <>
            <div className={styles.authPage} >
                <div className={styles.authWrapper} style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={global.state === 'register'} fallback={
                        <DisplayLogin />
                    }>
                        <DisplayRegister />
                    </Show>
                </div>
            </div>
        </>
    )
}
