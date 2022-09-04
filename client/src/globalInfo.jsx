import Axios from "axios";
import { createStore } from "solid-js/store";

import { createEffect, createSignal } from "solid-js";
import data from './data/data.json';

export const staticConst = {
    LOCAL_SUBJECT_KEY: "subjects",
    LOCAL_HISTORY_KEY: "history",
    LOCAL_SESSION_KEY: "session",
    url: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8080' : window.location.origin,
    blur: 'blur(4px)'
}

export const [global, setGlobal] = createStore({
    logged: false,
    state: '',
    round: 3,
    score: [0, 0],
    alreadyDone: [],
    showWarning: {
        state: false,
        msg: ''
    }
})

export const [loading, setLoading] = createSignal(0)

export const [userInfo, setUserInfo] = createStore({
    email: '',
    nom: '',
    prenom: '',
    phone: '',
    numPlays: '',
    plan: '',
    startDate: '',
    endDate: '',
    cusId: '',
    subId: '',
    cancelWhenEnd: '',
    history: ''
})

export const [subjects, setSubjects] = createStore(setupSubjects())

const session = setupSession()

export function showWarning(msg, type) {
    if (!global.showWarning.state) {
        setGlobal('showWarning', 'msg', msg)
        setGlobal('showWarning', 'state', true)
        setGlobal('showWarning', 'type', (type === 'green' ? 'green' : 'red'))
        setTimeout(() => {
            setGlobal('showWarning', 'state', false)
            setGlobal('showWarning', 'msg', '')
        }, 3000);
    }
}

function setupSubjects() {
    let subjects = {}
    if (localStorage.getItem(staticConst.LOCAL_SUBJECT_KEY) === null) {
        data.forEach(item => {
            const matiere = item.matiere
            const chapitre = item.chapitre
            subjects[matiere] = { ...subjects[matiere], [chapitre]: false }
        })
        localStorage.setItem(staticConst.LOCAL_SUBJECT_KEY, JSON.stringify(subjects))
    } else {
        subjects = JSON.parse(localStorage.getItem(staticConst.LOCAL_SUBJECT_KEY))
        let localSubs = {};
        [...Object.keys(subjects)].forEach(mat => {
            let _chaps = [];
            [...Object.keys(subjects[mat])].forEach(chap => {
                _chaps.push(chap)
            })
            localSubs = { ...localSubs, [mat]: _chaps }
        })
        let dataSubs = {}
        data.forEach(item => {
            const matiere = item.matiere
            const chapitre = item.chapitre
            if (dataSubs[matiere] === undefined) {
                dataSubs[matiere] = [chapitre]
            } else {
                if (!dataSubs[matiere].includes(chapitre)) {
                    dataSubs[matiere] = [...dataSubs[matiere], chapitre]
                }
            }
        })
        if(JSON.stringify(localSubs) !== JSON.stringify(dataSubs)){
            subjects = {}
            data.forEach(item => {
                const matiere = item.matiere
                const chapitre = item.chapitre
                subjects[matiere] = { ...subjects[matiere], [chapitre]: false }
            })
            localStorage.setItem(staticConst.LOCAL_SUBJECT_KEY, JSON.stringify(subjects))
        }
    }
    return subjects
}

export function getChapters(type) {
    let result = []
    Object.keys(subjects).forEach(subject => {
        Object.keys(subjects[subject]).forEach(chapter => {
            if (type === 'all') {
                result = [...result, chapter]
            } else if (type === 'selected') {
                if (subjects[subject][chapter]) {
                    result = [...result, chapter]
                }
            } else if (type === 'unselected') {
                if (!subjects[subject][chapter]) {
                    result = [...result, chapter]
                }
            }
        })
    })
    return result
}

export function resetGlobal() {
    setGlobal('state', '')
    setGlobal('score', [0, 0])
    setGlobal('alreadyDone', [])
}

export function updatePlays(setup = false) {
    setLoading(a => a + 1)
    Axios.post(staticConst.url + '/api/updateplays', {
        token: session,
        setup: setup
    }).then((res) => {
        setUserInfo('numPlays', res.data)
        setLoading(a => a - 1)
    })
}

function verifyPlan() {
    setLoading(a => a + 1)
    Axios.post(staticConst.url + '/api/verify_plan', {
        token: session
    }).then((res) => {
        setUserInfo('plan', res.data)
        setLoading(a => a - 1)
    })
}

function getStripeData() {
    setLoading(a => a + 1)
    Axios.post(staticConst.url + '/api/stripe_data', {
        token: session
    }).then((res) => {
        setUserInfo('startDate', res.data.startDate)
        setUserInfo('endDate', res.data.endDate)
        setUserInfo('cancelWhenEnd', res.data.cancelWhenEnd)
        setUserInfo('subId', res.data.subId)
        setUserInfo('cusId', res.data.cusId)
        verifyPlan()
        setLoading(a => a - 1)
    })
}

function setupSession() {
    if (localStorage.getItem(staticConst.LOCAL_SESSION_KEY) === null) {
        localStorage.setItem(staticConst.LOCAL_SESSION_KEY, JSON.stringify(""))
    }
    return JSON.parse(localStorage.getItem(staticConst.LOCAL_SESSION_KEY))
}

export default function SetupGlobal() {
    authentification()
    function authentification() {
        setLoading(a => a + 1)
        Axios.get(staticConst.url + '/api/check', {
            params: {
                token: session
            }
        }).then((res) => {
            if (res.data !== false) {
                setUserInfo(res.data)
                updatePlays(true)
                getStripeData()
                setGlobal('logged', true)
                if (window.location.pathname === '/auth') {
                    window.location.replace('/')
                }
            } else {
                setGlobal('logged', false)
                if (window.location.pathname !== '/auth') {
                    window.location.replace('/auth')
                }
            }
            setLoading(a => a - 1)
        })
    }
}