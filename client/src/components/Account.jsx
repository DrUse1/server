import { createEffect, createSignal } from "solid-js";
import Header from "./Header";

import styles from '../styles/account.module.scss'
import { global, loading, setGlobal, setLoading, setUserInfo, showWarning, staticConst, userInfo } from "../globalInfo";
import { createStore } from "solid-js/store";
import Axios from "axios";
import { useNavigate } from "@solidjs/router";
import Footer from "./Footer";

export default function Account() {
    const navigate = useNavigate()

    const [activeItem, setActiveItem] = createSignal(['informations', 'Informations'])
    const [warning, setWarning] = createSignal('')
    const [passwordVisibility, setPasswordVisibility] = createStore({ fst: 'password', scd: 'password', thd: 'password' })
    const [infoForm, setInfoForm] = createStore({
        'prenom': userInfo.prenom,
        'nom': userInfo.nom,
        'phone': userInfo.phone
    })
    const [passForm, setPassForm] = createStore({
        'old': '',
        'new': '',
        'confirmNew': ''
    })

    const requires = {
        'minLen': '8 caractères minimum',
        'upper': '1 majuscule',
        'lower': '1 minusclue',
        'number': '1 chiffre',
        'special': '1 caractère spécial'
    }

    function submitInfoForm() {
        if (infoForm.prenom.length >= 2 && infoForm.nom.length >= 2 && infoForm.phone.length >= 2) {
            setLoading(a => a + 1)
            Axios.post(staticConst.url + '/api/updateData', {
                token: JSON.parse(localStorage.getItem(staticConst.LOCAL_SESSION_KEY)),
                prenom: infoForm.prenom,
                nom: infoForm.nom,
                phone: infoForm.phone,
            }).then(() => {
                showWarning('Les modifications ont bien été faites !', 'green')
                setLoading(a => a - 1)
            })
        } else {
            setWarning('Les champs doivent être supérieurs à 2 caratères')
        }

    }

    function cancelAtEndPeriod(choice) {
        setLoading(a => a + 1)
        Axios.post(staticConst.url + '/api/stripe_cancel', {
            subId: userInfo.subId,
            choice: choice
        }).then((res) => {
            console.log(res.data)
            if (res.data) {
                showWarning('La modification a été faite !', 'green')
                setUserInfo('cancelWhenEnd', choice)
            } else {
                showWarning('Une erreur est parvenue, réessayes plus tard')
            }
            setLoading(a => a - 1)
        })
    }

    function handleChange(value) {
        setPassForm('new', value)
        const number = '0123456789'
        const special = '/*-+!:;,*$^#~&?.<>%£µ()[]{}°|@='
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        document.getElementsByClassName('minLen')[0].classList.remove(styles.valid)
        document.getElementsByClassName('upper')[0].classList.remove(styles.valid)
        document.getElementsByClassName('lower')[0].classList.remove(styles.valid)
        document.getElementsByClassName('special')[0].classList.remove(styles.valid)
        document.getElementsByClassName('number')[0].classList.remove(styles.valid)
        if (passForm.new.length >= 8) {
            document.getElementsByClassName('minLen')[0].classList.add(styles.valid)
        }
        for (let i = 0; i < passForm.new.length; i++) {
            if (number.includes(passForm.new[i])) {
                document.getElementsByClassName('number')[0].classList.add(styles.valid)
            }
            if (upper.includes(passForm.new[i])) {
                document.getElementsByClassName('upper')[0].classList.add(styles.valid)
            }
            if (lower.includes(passForm.new[i])) {
                document.getElementsByClassName('lower')[0].classList.add(styles.valid)
            }
            if (special.includes(passForm.new[i])) {
                document.getElementsByClassName('special')[0].classList.add(styles.valid)
            }
        }
    }

    function submitPassForm() {
        if (passForm.new !== passForm.confirmNew) {
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
        Axios.post(staticConst.url + '/api/updatePassword', {
            token: JSON.parse(localStorage.getItem(staticConst.LOCAL_SESSION_KEY)),
            old: passForm.old,
            new: passForm.new
        }).then((res) => {
            setLoading(a => a - 1)
            console.log(res.data)
            if (res.data[0]) {
                setPassForm('old', '')
                handleChange('')
                setPassForm('confirmNew', '')
                showWarning('Le mot de passe a bien été modifié !', 'green')
            } else {
                if (res.data[1] === 'password') {
                    showWarning('Le mot de passe actuel est faux')
                } else if (res.data[1] === 'token') {
                    window.location.reload()
                }
            }
        })
    }

    document.getElementsByTagName('html')[0].addEventListener('click', () => {
        setTimeout(() => {
            if (document.getElementsByClassName(styles.accountNavItems).length === 0) return
            document.getElementsByClassName(styles.accountNavItems)[0].classList.remove(styles.active)
            document.getElementsByClassName(styles.accountNavTitleArrow)[0].classList.remove(styles.active)
        }, 1);
    })

    return (
        <>
            <Header />
            <div className={styles.accountWrapper}>
                <div className={styles.accountNav}>
                    <div className={styles.accountNavTitle}
                        onClick={() => {
                            if (!document.getElementsByClassName(styles.accountNavItems)[0].className.includes(styles.active)) {
                                setTimeout(() => {
                                    if (!document.getElementsByClassName(styles.accountNavItems)[0].className.includes(styles.active)) {
                                        document.getElementsByClassName(styles.accountNavItems)[0].classList.add(styles.active)
                                        document.getElementsByClassName(styles.accountNavTitleArrow)[0].classList.add(styles.active)
                                    }
                                }, 2);
                            }
                        }}>
                        <div className={styles.accountNavTitleContent}>
                            <span>{activeItem()[1]}</span>
                            <svg className={styles.accountNavTitleArrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.accountNavItems}>
                        <button onClick={() => { setActiveItem(['informations', 'Informations']); setWarning('') }}
                            className={styles.accountNavItem + ' ' + (activeItem()[0] === 'informations' ? styles.active : '')}>
                            <span>Informations</span>
                        </button>
                        <button onClick={() => { setActiveItem(['password', 'Mot de passe']); setWarning('') }}
                            className={styles.accountNavItem + ' ' + (activeItem()[0] === 'password' ? styles.active : '')}>
                            <span>Mot de passe</span>
                        </button>
                        <button onClick={() => { setActiveItem(['plan', 'Abonnement']); setWarning('') }}
                            className={styles.accountNavItem + ' ' + (activeItem()[0] === 'plan' ? styles.active : '')}>
                            <span>Abonnement</span>
                        </button>
                    </div>
                </div>
                <div className={styles.accountContent} style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={activeItem()[0] === 'informations'}>
                        <div className={styles.accountContentTitle}>
                            <span>Informations</span>
                        </div>
                        <div className={styles.accountInfo}>
                            <div className={styles.accountInfoFormWrapper}>
                                <div className={styles.accountInfoFormItems}>
                                    <div className={styles.accountInfoFormItem}>
                                        <span>Prénom</span>
                                        <input
                                            type="text"
                                            value={infoForm.prenom}
                                            onChange={(e) => { setInfoForm('prenom', e.target.value); setWarning('') }}
                                            required
                                            autocomplete="chrome-off" />
                                    </div>
                                    <div className={styles.accountInfoFormItem}>
                                        <span>Nom</span>
                                        <input
                                            type="text"
                                            value={infoForm.nom}
                                            onChange={(e) => { setInfoForm('nom', e.target.value); setWarning('') }}
                                            required
                                            autocomplete="chrome-off" />
                                    </div>
                                    <div className={styles.accountInfoFormItem}>
                                        <span>Numéro de téléphone</span>
                                        <input
                                            type="number"
                                            value={infoForm.phone}
                                            onChange={(e) => { setInfoForm('phone', e.target.value); setWarning('') }}
                                            required
                                            autocomplete="chrome-off" />
                                    </div>
                                </div>
                                <button onClick={() => submitInfoForm()} className={styles.accountInfoSubmit}>
                                    <span>Sauvegarder</span>
                                </button>
                                <Show when={warning().length > 0}>
                                    <br />
                                    <span className={styles.warning}>{warning()}</span>
                                </Show>
                            </div>
                        </div>
                    </Show>
                    <Show when={activeItem()[0] === 'password'}>
                        <div className={styles.accountContentTitle}>
                            <span>Mot de passe</span>
                        </div>
                        <div className={styles.accountPass}>
                            <div className={styles.accountPassFormWrapper}>
                                <div className={styles.accountPassFormItems}>
                                    <div className={styles.accountPassFormItem}>
                                        <span>Ancien Mot De Passe</span>
                                        <div className={styles.passwordFieldWrapper}>
                                            <input
                                                type={passwordVisibility.fst}
                                                value={passForm.old}
                                                onChange={(e) => { setPassForm('old', e.target.value); setWarning('') }}
                                                required
                                                autocomplete="chrome-off" />
                                            <div className={styles.passwordIconWrapper}>
                                                <div className={styles.passwordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility('fst', passwordVisibility.fst === 'password' ? 'text' : 'password') } }}>
                                                    <Show when={passwordVisibility.fst === 'password'} fallback={
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
                                    <div className={styles.accountPassFormItem}>
                                        <span>Nouveau Mot De Passe</span>
                                        <div className={styles.passwordFieldWrapper}>
                                            <input
                                                type={passwordVisibility.scd}
                                                value={passForm.new}
                                                onInput={(e) => { handleChange(e.target.value); setWarning('') }}
                                                required
                                                autocomplete="chrome-off" />
                                            <div className={styles.passwordIconWrapper}>
                                                <div className={styles.passwordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility('scd', passwordVisibility.scd === 'password' ? 'text' : 'password') } }}>
                                                    <Show when={passwordVisibility.scd === 'password'} fallback={
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
                                    <div className={styles.accountPassFormItem}>
                                        <span>Confirmer Nouveau Mot De Passe</span>
                                        <div className={styles.passwordFieldWrapper}>
                                            <input
                                                type={passwordVisibility.thd}
                                                value={passForm.confirmNew}
                                                onChange={(e) => { setPassForm('confirmNew', e.target.value); setWarning('') }}
                                                required
                                                autocomplete="chrome-off" />
                                            <div className={styles.passwordIconWrapper}>
                                                <div className={styles.passwordButton} onClick={(e) => { e.preventDefault(); { e.pointerType !== '' && setPasswordVisibility('thd', passwordVisibility.thd === 'password' ? 'text' : 'password') } }}>
                                                    <Show when={passwordVisibility.thd === 'password'} fallback={
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
                                    <div className={styles.passRequires}>
                                        <For each={Object.entries(requires)}>{([requireCode, requireValue]) =>
                                            <div className={styles.passRequireItemWrapper}>
                                                <div className={styles.passRequireItem + ' requireItem ' + requireCode}>
                                                    <span>{requireValue}</span>
                                                </div>
                                            </div>
                                        }</For>
                                    </div>
                                </div>
                                <button onClick={() => submitPassForm()} className={styles.accountPassSubmit}>
                                    <span>Sauvegarder</span>
                                </button>
                                <Show when={warning().length > 0}>
                                    <br />
                                    <span className={styles.warning}>{warning()}</span>
                                </Show>
                            </div>
                        </div>
                    </Show>
                    <Show when={activeItem()[0] === 'plan'}>
                        <div className={styles.accountContentTitle}>
                            <span>Abonnement</span>
                        </div>
                        <div className={styles.accountPlan}>
                            <span className={styles.left}>Abonnement actuel</span>
                            <span className={styles.right}>{userInfo.plan[0].toUpperCase() + userInfo.plan.slice(1)}</span>
                            <Show when={userInfo.plan === 'basic'} fallback={
                                <>
                                    <span className={styles.left}>Se termine le</span>
                                    <span className={styles.right}>{userInfo.endDate.replaceAll('-', '/')}</span>
                                    <span className={styles.left}>Prélevement automatique</span>
                                    <span className={styles.right}>{userInfo.cancelWhenEnd ? 'Désactivé' : 'Activé'}</span>
                                    {userInfo.cancelWhenEnd ?
                                        <button onClick={() => cancelAtEndPeriod(false)}>Activer le prélevement automatique</button> :
                                        <button onClick={() => cancelAtEndPeriod(true)}>Désactiver le prélevement automatique</button>}
                                </>
                            }>
                                <button onClick={() => navigate('/plan')}>
                                    <span>Changer d'abonnement</span>
                                </button>
                            </Show>
                        </div>
                    </Show>
                </div>
            </div>
            <Footer style='header' />
        </>
    )
}
