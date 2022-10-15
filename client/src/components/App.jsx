import { createSignal, Show, For } from "solid-js"
import { createStore } from "solid-js/store";

import { staticConst, global, setGlobal, subjects, updatePlays, userInfo, getChapters, loading, setLoading, data, showWarning } from '../globalInfo'

import * as utils from '../utils'
import Axios from "axios";


export default function App() {
    if (userInfo.numPlays >= global.dailyLimit) {
        if (userInfo.plan === 'basic') {
            window.location.replace('/')
            return
        }
    }
    if (userInfo.plan === 'basic') {
        updatePlays()
    }
    const [item, setItem] = createStore(getItem())
    const [submitted, setSubmitted] = createSignal(false)
    const [questionNum, setQuestionNum] = createSignal(1)
    const [askConfirmation, setAskConfirmation] = createSignal([false])
    const [disableButton, setDisableButton] = createSignal(true)
    const [selected, setSelected] = createSignal([])

    const [reportMsg, setReportMsg] = createSignal('')

    let serieHistory = []

    setupNumQuestions()
    function setupNumQuestions() {
        let count = 0;
        data.forEach(each => {
            if (subjects[each.matiere][each.chapitre]) {
                count++
            }
        })
        if (localStorage.getItem(staticConst.LOCAL_SPEC_KEY) === 'true' &&
            ['mohamed.mataam1@gmail.com', 'opvxgame@gmail.com'].includes(userInfo.email)) {
            setGlobal('round', count)
        } else {
            setGlobal('round', (count < global.maxRound ? count : global.maxRound))
        }
    }

    function getSelectedAnswers() {
        let list = []
        item.answers.forEach((e, i) => {
            if (e.color === 'yellow') { list.push(i) }
        })
        return list
    }

    function getItem() {
        let index;
        loop()
        function loop() {
            index = utils.getRandomInt(data.length)
            if (global.alreadyDone.includes(index) || getChapters('unselected').includes(data[index].chapitre.toString())) {
                loop()
            }
        }
        setGlobal('alreadyDone', [...global.alreadyDone, index])
        return (formatItem(data[index]))
    }

    function formatItem(it) {
        let answers = []
        for (let i = 0; i < 5; i++) {
            if (it[`answer${i}`] !== '') {
                answers.push(
                    {
                        'id': i,
                        'value': it[`answer${i}`],
                        'color': 'white'
                    }
                )
            }
            delete it[`answer${i}`]
        }
        it.answers = answers
        return it
    }

    function handleClick(type, i) {
        if (type === 'answer') {
            if (submitted()) return
            document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.remove('yellow', 'colored', 'white', 'red', 'green')
            if (item.answers[i].color === 'white') {
                setItem('answers', i, 'color', 'yellow')
                document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.add('yellow', 'colored')
            } else {
                setItem('answers', i, 'color', 'white')
                document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.add('white')
            }

            if (getSelectedAnswers().length === 0) {
                setDisableButton(true)
            } else {
                setDisableButton(false)
            }
        }
    }

    function Score() {
        return (
            <>
                <h3>Question {questionNum()}/{global.round}</h3>
                <span>{item.matiere} - {item.chapitre}</span>
            </>
        )
    }

    function Question() {
        function FormatQuestion(props) {
            let q = props.question.toString()
            return (
                <>
                    <span>
                        <For each={q.split('//')}>{(atom, i) =>
                            <Show when={i() % 2 === 0} fallback={
                                <>
                                    <span className="supsub">
                                        <Show when={atom.split('/').length > 1} fallback={
                                            <>
                                                <span className="sub alone">{atom.split('/')[0]}</span>
                                            </>
                                        }>
                                            <>
                                                <Show when={atom.split('/')[0].includes('+') || atom.split('/')[0].includes('-') || atom.split('/')[0].includes('*')} fallback={
                                                    <>
                                                        <span className={"sup"}>{atom.split('/')[0]}</span>
                                                        <span className={"sub"}>{atom.split('/')[1]}</span>
                                                    </>
                                                }>
                                                    <>
                                                        <sup>{atom.split('/')[0]}</sup>
                                                        <sub>{atom.split('/')[1]}</sub>
                                                    </>
                                                </Show>
                                            </>
                                        </Show>
                                    </span>
                                </>
                            }>
                                <For each={atom.split('/*')}>{(ion, j) =>
                                    <Show when={j() % 2 === 0} fallback={
                                        <sup className="ion">{ion}</sup>
                                    }>
                                        <For each={ion.split('*/')}>{(sub, k) =>
                                            <Show when={k() % 2 === 0} fallback={
                                                <sub className="sub">{sub}</sub>
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
        return (
            <>
                <For each={[item.question]}>{i =>
                    <FormatQuestion question={i} />
                }</For>
            </>
        )
    }

    function Answers() {
        const letters = 'ABCDEFGH'

        function FormatAnswer(props) {
            let q = props.answer.toString()
            return (
                <>
                    <span>
                        <For each={q.split('//')}>{(atom, i) =>
                            <Show when={i() % 2 === 0} fallback={
                                <>
                                    <span className="supsub">
                                        <Show when={atom.split('/').length > 1} fallback={
                                            <>
                                                <span className="sub alone">{atom.split('/')[0]}</span>
                                            </>
                                        }>
                                            <>
                                                <Show when={atom.split('/')[0].includes('+') || atom.split('/')[0].includes('-') || atom.split('/')[0].includes('*')} fallback={
                                                    <>
                                                        <span className={"sup"}>{atom.split('/')[0]}</span>
                                                        <span className={"sub"}>{atom.split('/')[1]}</span>
                                                    </>
                                                }>
                                                    <>
                                                        <sup>{atom.split('/')[0]}</sup>
                                                        <sub>{atom.split('/')[1]}</sub>
                                                    </>
                                                </Show>
                                            </>
                                        </Show>
                                    </span>
                                </>
                            }>
                                <For each={atom.split('/*')}>{(ion, j) =>
                                    <Show when={j() % 2 === 0} fallback={
                                        <sup className="ion">{ion}</sup>
                                    }>
                                        <For each={ion.split('*/')}>{(sub, k) =>
                                            <Show when={k() % 2 === 0} fallback={
                                                <sub className="sub">{sub}</sub>
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

        return (
            <>
                <For each={item.answers}>
                    {(answer) =>
                        <div className={"appAnswerItemWrapper"}>
                            <button className={"appAnswerItemContent"} onClick={() => handleClick('answer', answer.id)}>
                                <h2>
                                    {letters[answer.id]}
                                </h2>
                                <FormatAnswer answer={answer.value.split('---')[0]} />
                            </button>
                            <Show when={answer.value.includes('---')}>
                                <div className={"appAnswerItemExplanation"}>
                                    <span>{answer.value.split('---')[1]}</span>
                                </div>
                            </Show>
                        </div>
                    }
                </For>
            </>
        )
    }

    function Other() {
        function submitAnswer() {
            setSelected(getSelectedAnswers())
            if (selected().length !== 0) {
                setSubmitted(true)
                let failed = false
                item.answers.forEach((answer, i) => {
                    if (item.answer.toString().includes(i)) {
                        if (answer.color === 'white') {
                            failed = true
                        }
                        setItem('answers', i, 'color', 'green')
                        document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.remove('yellow', 'colored', 'white', 'red', 'green')
                        document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.add('green', 'colored')
                    } else {
                        if (answer.color === 'yellow') {
                            setItem('answers', i, 'color', 'red')
                            failed = true
                            document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.remove('yellow', 'colored', 'white', 'red', 'green')
                            document.getElementsByClassName('appAnswersWrapper')[0].children[i].children[0].classList.add('red', 'colored')
                        }
                    }
                })
                if (failed === false) {
                    setGlobal('score', [global.score[0] + 1, global.score[1]])
                }
                setGlobal('score', [global.score[0], global.score[1] + 1])
                saveItem(failed)
                if (global.state === 'exam') {
                    nextQuestion()
                }
            }
            for (let i = 0; i < document.getElementsByClassName('appAnswerItemWrapper').length; i++) {
                if (document.getElementsByClassName('appAnswerItemWrapper')[i].children.length >= 2) {
                    document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].style.display = 'block';
                    document.getElementsByClassName('appAnswerItemWrapper')[i].style.maxHeight = (document.getElementsByClassName('appAnswerItemWrapper')[i].children[0].clientHeight
                        + document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].clientHeight
                        - 36) + 'px'
                }
            }
        }

        function saveItem(failed) {
            const itemToAdd = {
                id: item.id,
                result: !failed,
                num: questionNum(),
                subject: item.matiere,
                chapter: item.chapitre,
                selected: selected()
            }
            serieHistory = [...serieHistory, itemToAdd]
        }

        function nextQuestion() {
            setSubmitted(false)
            setDisableButton(true)
            if (global.score[1] < global.round) {
                setQuestionNum(prev => prev + 1)
                setItem(getItem())
            } else {
                saveRun()
            }
        }

        function saveRun() {
            let list = {};
            [...Object.keys(subjects)].forEach(sub => {
                let _list = [];
                [...Object.keys(subjects[sub])].forEach(mat => {
                    if (subjects[sub][mat]) {
                        _list.push(mat)
                    }
                })
                if (_list.length > 0) {
                    list = { ...list, [sub]: _list }
                }
            })

            const _toAdd = {
                questions: serieHistory,
                infos: {
                    'score': global.score,
                    'subjects': list,
                    'type': global.state
                }
            }

            setLoading(a => a + 1)
            Axios.post(staticConst.url + '/api/history', {
                token: JSON.parse(localStorage.getItem(staticConst.LOCAL_SESSION_KEY)),
                toAdd: _toAdd
            }).then((res) => {
                setLoading(a => a - 1)
                if (res) {
                    localStorage.setItem(staticConst.LOCAL_HISTORY_KEY, 0)
                    window.location.replace('score')
                } else {
                    window.location.reload()
                }
            })

        }

        function reportQuestion() {
            document.getElementsByClassName('appReport')[0].classList.add('active')
            document.getElementsByClassName('overlay')[0].classList.add('active')
        }

        document.getElementsByClassName('overlay')[0].addEventListener('click', () => {
            document.getElementsByClassName('appReport')[0].classList.remove('active')
            document.getElementsByClassName('overlay')[0].classList.remove('active')
        })

        // let inter;
        // function launchInter() {
        //     inter = setInterval(() => {
        //         if (loading() === 0 && window.location.pathname === '/app' && global.score[1] < global.round - 1) {
        //             handleClick('answer', 1)
        //             submitAnswer()
        //             nextQuestion()
        //             if (document.getElementsByClassName('appQuestionWrapper')[0].innerHTML.replaceAll('</', '<').replaceAll('/>', '>').includes('/')) {
        //                 console.log('stopped question')
        //                 console.log(document.getElementsByClassName('appQuestionWrapper')[0].innerHTML.replaceAll('</', '<').replaceAll('/>', '>').replaceAll('/', '>>>>>/<<<<<'))
        //                 //clearInterval(inter)
        //             }
        //             if (document.getElementsByClassName('appAnswersWrapper')[0].innerHTML.replaceAll('</', '<').replaceAll('/>', '>').includes('/')) {
        //                 console.log('stopped answers')
        //                 console.log(document.getElementsByClassName('appAnswersWrapper')[0].innerHTML.replaceAll('</', '<').replaceAll('/>', '>').replaceAll('/', '>>>>>/<<<<<'))
        //                 //clearInterval(inter)
        //             }
        //         } else {
        //             clearInterval(inter)
        //         }
        //     }, 20);
        // }

        return (
            <>
                <div className="appOtherContent">
                    {/* <button onClick={() => launchInter()}>launch interval</button>
                    <button onClick={() => clearInterval(inter)}>stop interval</button> */}
                    <Show when={askConfirmation()[0]} fallback={
                        <>
                            <button className={"appSubmit"} onClick={() => reportQuestion()}>Signaler</button>
                            <Show when={submitted()} fallback={
                                <button className={"appSubmit"} onClick={() => submitAnswer()} disabled={disableButton()}>Valider</button>
                            }>
                                <button className={"appSubmit"} onClick={() => nextQuestion()}>
                                    {global.score[1] < global.round ? 'Question suivante' : 'Finir la série'}
                                </button>
                            </Show>
                            <button className={"appCancel"} onClick={() => setAskConfirmation([true, () => { window.location.replace('/') }, 'annuler la série'])}>Annuler la série</button>
                        </>
                    }>
                        <h4>Veux-tu vraiment {askConfirmation()[2]} ?</h4>
                        <button onClick={() => askConfirmation()[1]()}>Oui</button>
                        <button onClick={() => setAskConfirmation([false])}>Non</button>
                    </Show>
                </div>
            </>

        )
    }

    window.addEventListener('resize', () => {
        for (let i = 0; i < document.getElementsByClassName('appAnswerItemWrapper').length; i++) {
            if (document.getElementsByClassName('appAnswerItemWrapper')[i].children.length >= 2 && document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].clientHeight !== 0) {
                document.getElementsByClassName('appAnswerItemWrapper')[i].style.maxHeight = (document.getElementsByClassName('appAnswerItemWrapper')[i].children[0].clientHeight
                    + document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].clientHeight
                    - 36) + 'px'
            }
        }
    })

    setTimeout(() => {
        for (let i = 0; i < document.getElementsByClassName('appAnswerItemWrapper').length; i++) {
            if (document.getElementsByClassName('appAnswerItemWrapper')[i].children.length >= 2 && document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].clientHeight !== 0) {
                document.getElementsByClassName('appAnswerItemWrapper')[i].style.maxHeight = (document.getElementsByClassName('appAnswerItemWrapper')[i].children[0].clientHeight
                    + document.getElementsByClassName('appAnswerItemWrapper')[i].children[1].clientHeight
                    - 36) + 'px'
            }
        }
    }, 0);

    function sendReport() {
        if (reportMsg() === '') {
            showWarning('Veuillez ajoutez un commentaire pour le signalement', 'red')
        } else if (reportMsg().length > 200) {
            showWarning('Commentaire trop long', 'red')
        }
        else {
            showWarning('Merci pour le signalement !', 'green')
            Axios.post(staticConst.url + '/api/report', {
                id: item.id,
                msg: reportMsg()
            })
            setReportMsg('')
            document.getElementsByClassName('appReport')[0].classList.remove('active')
            document.getElementsByClassName('overlay')[0].classList.remove('active')
        }
    }

    return (
        <>
            <div className="appReport">
                <span>Ajoutes un commentaire avec ce signalement</span>
                <span>{reportMsg().length} / 200</span>
                <textarea
                    rows={3}
                    onInput={(e) => setReportMsg(e.target.value)}
                    value={reportMsg()}
                    maxlength="200"></textarea>
                <button onClick={() => sendReport()}>
                    <span>Envoyez</span>
                </button>
            </div>
            <div className={"appWrapper"}>
                <div className={"appScoreWrapper"}>
                    <Score />
                </div>
                <div className={"appQuestionWrapper"} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                    <Question />
                </div>
                <div className={"appAnswersWrapper"} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                    <Answers />
                </div>
                <div className={"appOtherWrapper"}>
                    <Other />
                </div>
            </div>
        </>
    )
}
