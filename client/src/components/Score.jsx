import { staticConst, loading, userInfo } from '../globalInfo'
import Header from './Header'
import styles from '../styles/score.module.scss'
import { createSignal, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import Footer from './Footer'

export default function Score(props) {
    const navigate = useNavigate()
    const [displayHistory, setDisplayHistory] = createSignal('all')

    if (userInfo.history.length === 0) {
        navigate('/')
        return
    }

    if (localStorage.getItem(staticConst.LOCAL_HISTORY_KEY) == undefined ||
        userInfo.history.length <= localStorage.getItem(staticConst.LOCAL_HISTORY_KEY)) {
        localStorage.setItem(staticConst.LOCAL_HISTORY_KEY, 0)
    }
    const run = JSON.parse(JSON.stringify(userInfo.history[localStorage.getItem(staticConst.LOCAL_HISTORY_KEY)]))

    function getItems() {
        if (displayHistory() === 'all') {
            return run.questions
        } else {
            let questions = []
            run.questions.forEach(each => {
                if (displayHistory() === 'success') {
                    if (each.result) {
                        questions.push(each)
                    }
                } else {
                    if (!each.result) {
                        questions.push(each)
                    }
                }
            })
            return questions
        }
    }

    function calculateHeight(elements) {
        let sum = 0
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].localName !== 'svg') {
                var styles = window.getComputedStyle(elements[i]);
                var margin = parseFloat(styles['marginTop']) +
                    parseFloat(styles['marginBottom']);
                sum += Math.ceil(elements[i].offsetHeight + margin);
            }
        }
        return sum
    }

    function getQuestion(ask, elem) {
        let item = Array.from(props.data).find(item => item.id.toString() === elem.id.toString())
        if (ask === 'question') {
            return item.question
        } else if (ask === 'answers') {
            let list = []
            for (let i = 0; i < 5; i++) {
                if (item['answer' + i] !== '') {
                    function getColor() {
                        let color = 'white'
                        if (elem.selected.includes(i)) {
                            if (!item.answer.toString().includes(i)) {
                                color = 'red'
                            }
                        }
                        if (item.answer.toString().includes(i)) {
                            color = 'green'
                        }
                        return color
                    }
                    list = [...list, { color: getColor(), value: item['answer' + i] }]
                }
            }
            return list
        }
    }

    function FormatAnswer(props) {
        let q = props.answer.toString()
        return (
            <>
                <span className={props.className}>
                    <For each={q.split('//')}>{(atom, i) =>
                        <Show when={i() % 2 === 0} fallback={
                            <>
                                <span className={styles.supsub}>
                                    <Show when={atom.split('/').length > 1} fallback={
                                        <>
                                            <span className={styles.sub + ' ' + styles.alone}>{atom.split('/')[0]}</span>
                                        </>
                                    }>
                                        <>
                                            <span className={styles.sup}>{atom.split('/')[0]}</span>
                                            <span className={styles.sub}>{atom.split('/')[1]}</span>
                                        </>
                                    </Show>
                                </span>
                            </>
                        }>
                            <For each={atom.split('/*')}>{(ion, j) =>
                                <Show when={j() % 2 === 0} fallback={
                                    <sup className={styles.ion}>{ion}</sup>
                                }>
                                    <For each={ion.split('*/')}>{(sub, k) =>
                                        <Show when={k() % 2 === 0} fallback={
                                            <sub className={styles.sub}>{sub}</sub>
                                        }>
                                            <Show when={sub.split('_b').length > 1} fallback={
                                                <>
                                                    {sub}
                                                </>
                                            }>
                                                {sub.split('_b')[0]}
                                                <For each={sub.split('_b')}>{(br, l) =>
                                                    <>
                                                        <Show when={l() > 0}>
                                                            <br />
                                                            {br}
                                                        </Show>
                                                    </>
                                                }</For>
                                            </Show>
                                        </Show>
                                    }</For>
                                </Show>
                            }</For>
                        </Show>
                    }</For>
                </span>
            </>
        )
    }

    function FormatQuestion(props) {
        let q = props.question.toString()
        return (
            <>
                <span className={props.className}>
                    <For each={q.split('//')}>{(atom, i) =>
                        <Show when={i() % 2 === 0} fallback={
                            <>
                                <span className={styles.supsub}>
                                    <Show when={atom.split('/').length > 1} fallback={
                                        <>
                                            <span className={styles.sub + ' ' + styles.alone}>{atom.split('/')[0]}</span>
                                        </>
                                    }>
                                        <>
                                            <span className={styles.sup}>{atom.split('/')[0]}</span>
                                            <span className={styles.sub}>{atom.split('/')[1]}</span>
                                        </>
                                    </Show>
                                </span>
                            </>
                        }>
                            <For each={atom.split('/*')}>{(ion, j) =>
                                <Show when={j() % 2 === 0} fallback={
                                    <sup className={styles.ion}>{ion}</sup>
                                }>
                                    <For each={ion.split('*/')}>{(sub, k) =>
                                        <Show when={k() % 2 === 0} fallback={
                                            <sub className={styles.sub}>{sub}</sub>
                                        }>
                                            <Show when={sub.split('_b').length > 1} fallback={
                                                <>
                                                    {sub}
                                                </>
                                            }>
                                                {sub.split('_b')[0]}
                                                <For each={sub.split('_b')}>{(br, l) =>
                                                    <>
                                                        <Show when={l() > 0}>
                                                            <br />
                                                            {br}
                                                        </Show>
                                                    </>
                                                }</For>
                                            </Show>
                                        </Show>
                                    }</For>
                                </Show>
                            }</For>
                        </Show>
                    }</For>
                </span>
            </>
        )
    }

    function getAllChapters() {
        let sum = 0;
        Object.values(run.infos.subjects).forEach(e => {
            sum += e.length
        })
        return sum
    }

    function getSubjectsMaxHeight() {
        return 19 + 24 * [...run.infos.subjects[Object.keys(run.infos.subjects)[0]]].length + 12 + 16 + "px"
    }

    setTimeout(() => {
            document.getElementsByClassName(styles.scoreSubjects)[0].addEventListener('click', (e) => {
                if (document.getElementsByClassName(styles.scoreSubjects)[0].className.includes(styles.active)) {
                    document.getElementsByClassName(styles.scoreSubjects)[0].style.maxHeight = document.getElementsByClassName(styles.scoreSubject)[0].offsetHeight + 16 + "px"
                    document.getElementsByClassName(styles.scoreSubjects)[0].classList.remove(styles.active)
                } else {
                    document.getElementsByClassName(styles.scoreSubjects)[0].style.maxHeight = calculateHeight(document.getElementsByClassName(styles.scoreSubjects)[0].children) + 16 + "px"
                    document.getElementsByClassName(styles.scoreSubjects)[0].classList.add(styles.active)
                }
            })
    }, 1);

    return (
        <>
            <Header />
            <div className={styles.scoreWrapper} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.scoreTitle}>
                    <span>Tu as obtenu</span>
                </div>
                <div className={styles.score}>
                    <span>{run.infos.score[0]} / {run.infos.score[1]}</span>
                </div>
                <div className={styles.scoreSubjectsWrapper}>
                    <span>Sur les matières suivantes :</span>
                    <div className={styles.scoreSubjects} style={{ "max-height": getSubjectsMaxHeight() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z">
                                </path>
                            </svg>
                        <For each={Object.keys(run.infos.subjects)}>{(subject) =>
                            <div className={styles.scoreSubject}>
                                <span>{subject[0].toUpperCase() + subject.slice(1)}</span>
                                <div className={styles.scoreChapters}>
                                    <For each={run.infos.subjects[subject]}>{(chapter) =>
                                        <div className={styles.scoreChapter}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z">
                                                </path>
                                            </svg>
                                            <span>{chapter[0].toUpperCase() + chapter.slice(1)}</span>
                                        </div>
                                    }</For>
                                </div>
                            </div>
                        }</For>
                    </div>
                </div>
                <div className={styles.scoreHistoryWrapper}>
                    <div className={styles.scoreHistoryChoice}>
                        <button className={displayHistory() === 'all' ? styles.active : ''} onClick={() => setDisplayHistory('all')}>Toutes</button>
                        <button className={displayHistory() === 'success' ? styles.active : ''} onClick={() => setDisplayHistory('success')}>Réussies</button>
                        <button className={displayHistory() === 'fail' ? styles.active : ''} onClick={() => setDisplayHistory('fail')}>À revoir</button>
                    </div>
                    <div className={styles.scoreHistoryContent}>
                        <For each={getItems()} fallback={
                            <div>{displayHistory() === 'fail' ? 'Tu as fait 0 fautes ! Bravo !' : "Tu n'as eu aucune bonne réponse :("}</div>
                        }>{(each) =>
                            <div className={styles.scoreHistoryItemWrapper}>
                                <div onClick={(e) => {
                                    e.currentTarget.parentElement.lastChild.style = "--data-height: " + calculateHeight(e.currentTarget.parentElement.lastChild.children) + "px";
                                    e.currentTarget.parentElement.lastChild.className.includes(styles.active) ?
                                        e.currentTarget.parentElement.lastChild.classList.remove(styles.active) :
                                        e.currentTarget.parentElement.lastChild.classList.add(styles.active);
                                    e.currentTarget.className.includes(styles.active) ?
                                        e.currentTarget.classList.remove(styles.active) :
                                        e.currentTarget.classList.add(styles.active)
                                }} className={styles.scoreHistoryItemTitle}>
                                    <span>Question {each.num}</span>
                                    <span>{each.chapter[0].toUpperCase() + each.chapter.slice(1)}</span>
                                    <div className={styles.scoreHistoryItemArrow}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.scoreHistoryItemContent}>
                                    <FormatQuestion question={getQuestion('question', each)} />
                                    <div className={styles.scoreHistoryItemAnswers}>
                                        <For each={getQuestion('answers', each)}>{(answer, i) =>
                                            <FormatAnswer className={styles[answer.color] + ' ' + (each.selected.includes(i()) ? styles.selected : '')} answer={answer.value} />
                                        }</For>
                                    </div>
                                </div>
                            </div>
                            }</For>
                    </div>
                </div>
                <button className={styles.other} onClick={() => { window.location.replace('/') }}>Faire une autre série</button>
            </div >
            <Footer style='header' />
        </>
    )
}
