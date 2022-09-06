import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { loading, setLoading, showWarning, staticConst, userInfo } from "../globalInfo";
import Header from "./Header";

import styles from '../styles/contact.module.scss'
import Axios from "axios";
import Footer from "./Footer";

export default function Contact() {
    const [contact, setContact] = createStore({
        email: userInfo.email,
        object: '',
        message: ''
    })

    function handleSubmit() {
        setLoading(a => a + 1)
        Axios.post(staticConst.url + '/api/contact', {
            email: contact.email,
            object: contact.object,
            msg: contact.message
        }).then((res) => {
            setLoading(a => a - 1)
            if (res) {
                showWarning('Le message a bien été envoyé !', 'green')
            } else {
                showWarning('Une erreur est survenue. Réessayez plus tard.')
            }
        })
    }

    return (
        <>
            <Header />
            <div className={styles.contactWrapper} style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.contactTitle}>
                    <span>Contacter le support</span>
                </div>
                <div className={styles.contactForm}>
                    <div className={styles.inputItem}>
                        <span>Email</span>
                        <input
                            type="text"
                            onChange={(e) => setContact('email', e.target.value)}
                            value={contact.email}
                            required
                            disabled />
                    </div>
                    <div className={styles.inputItem}>
                        <span>Objet</span>
                        <input
                            type="text"
                            onChange={(e) => setContact('object', e.target.value)}
                            value={contact.object}
                            required />
                    </div>
                    <div className={styles.inputItem}>
                        <span>Message</span>
                        <textarea
                            type="text"
                            onChange={(e) => setContact('message', e.target.value)}
                            value={contact.message}
                        />
                    </div>
                </div>
                <button className={styles.submitButton} onClick={() => handleSubmit()}>
                    <span>Envoyer</span>
                </button>
            </div>
            <Footer style='header' />
        </>
    )
}
