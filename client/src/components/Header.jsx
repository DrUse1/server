import { useNavigate } from "@solidjs/router";
import { staticConst, userInfo } from "../globalInfo";

import styles from '../styles/header.module.scss'
import { LogoFull } from "./elements";

document.getElementsByTagName('html')[0].addEventListener('click', () => {
    setTimeout(() => {
        if (document.getElementsByClassName(styles.headerAccountDropdown).length === 0) return
        document.getElementsByClassName(styles.headerAccountDropdown)[0].classList.remove(styles.active)
    }, 1);
})

export default function Header() {
    const navigate = useNavigate()
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.headerHome}>
                    <button className={styles.headerLogo} onClick={() => window.location.replace('/')}>
                        <LogoFull />
                    </button>
                </div>
                <Show when={['mohamed.mataam1@gmail.com', 'opvxgame@gmail.com'].includes(userInfo.email)}>
                    <button onClick={() => (localStorage.setItem(staticConst.LOCAL_SPEC_KEY,
                        localStorage.getItem(staticConst.LOCAL_SPEC_KEY) !== 'true'), window.location.reload())}
                        style={{
                            'background-color': 'var(--color-lighter-grey)',
                            'border': 'none',
                            'border-radius': '20px',
                            'padding': '8px 16px',
                        }}>
                        Questions Spéciales : {localStorage.getItem(staticConst.LOCAL_SPEC_KEY)}
                    </button>
                </Show>
                <div className={styles.headerAccountWrapper}>
                    <button className={styles.headerAccountContent}
                        onClick={() => {
                            if (!document.getElementsByClassName(styles.headerAccountDropdown)[0].className.includes(styles.active)) {
                                setTimeout(() => {
                                    if (!document.getElementsByClassName(styles.headerAccountDropdown)[0].className.includes(styles.active)) {
                                        document.getElementsByClassName(styles.headerAccountDropdown)[0].classList.add(styles.active)
                                    }
                                }, 2);
                            }
                        }}>
                        <div className={styles.profilePic}>
                            <span>{userInfo.prenom[0] + userInfo.nom[0]}</span>
                        </div>
                        <h3>{userInfo.prenom}</h3>
                    </button>
                    <div className={styles.headerAccountDropdown}>
                        <button onClick={() => navigate('/account')}>Mon Compte</button>
                        <button onClick={() => navigate('/contact')}>Contact</button>
                        <button onClick={() => {
                            window.location.reload(false);
                            localStorage.setItem(staticConst.LOCAL_SESSION_KEY, JSON.stringify(''))
                        }}>Déconnexion</button>
                    </div>
                </div>
            </div >
        </div>
    )
}
