import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { loading, setLoading, showWarning, staticConst, userInfo } from "../globalInfo";
import Header from "./Header";

import styles from '../styles/contact.module.scss'
import Axios from "axios";
import Footer from "./Footer";

export default function Contact() {
    const [contact, setContact] = createStore({
        email: '',
        object: '',
        message: ''
    })

    function handleSubmit() {
        Axios.post(staticConst.url + '/api/contact', {
            email: contact.email,
            object: contact.object,
            msg: contact.message
        })
        showWarning('Le message a bien été envoyé !', 'green')
        setContact({
            email: '',
            object: '',
            message: ''
        })
    }

    return (
        <>
            <Show when={userInfo.email !== ''}>
                <Header />
            </Show>
            <div className={styles.contactWrapper + (userInfo.email !== '' ? ' ' + styles.header : '')} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
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
                            required />
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
            <Footer style={userInfo.email !== '' ? 'header' : ''} />
        </>
    )
}
