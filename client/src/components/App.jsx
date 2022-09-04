import { createSignal, Show, For } from "solid-js"
import { createStore } from "solid-js/store";

import { staticConst, global, setGlobal, resetGlobal, subjects, setSubjects, updatePlays, userInfo, getChapters, loading, setLoading, setUserInfo } from '../globalInfo'

import data from '../data/data.json'
import * as utils from '../utils'
import { useNavigate } from "@solidjs/router";
import Axios from "axios";


export default function App() {
    if (userInfo.numPlays >= 5) {
        if (userInfo.plan === 'basic') {
            window.location.replace('/')
            return
        }
    }
    if (userInfo.plan === 'basic') {
        updatePlays()
    }
    const navigate = useNavigate();

    const [item, setItem] = createStore(getItem())
    const [submitted, setSubmitted] = createSignal(false)
    const [questionNum, setQuestionNum] = createSignal(1)
    const [askConfirmation, setAskConfirmation] = createSignal([false])
    const [disableButton, setDisableButton] = createSignal(true)
    const [selected, setSelected] = createSignal([])

    let serieHistory = []

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
            document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.remove('yellow', 'colored', 'white', 'red', 'green')
            if (item.answers[i].color === 'white') {
                setItem('answers', i, 'color', 'yellow')
                document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.add('yellow', 'colored')
            } else {
                setItem('answers', i, 'color', 'white')
                document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.add('white')
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
        return (
            <>
                <Show when={item.img !== ''}>
                    <img alt="question" src={`../images/${item.img}.png`} width="400" height="auto"></img>
                </Show>
                <h1>{item.question}</h1>
            </>
        )
    }

    function Answers() {
        const letters = 'ABCDEFGH'
        return (
            <>
                <For each={item.answers}>
                    {(answer) =>
                        <button className={"appAnswerItemWrapper"} onClick={() => handleClick('answer', answer.id)}>
                            <h2>
                                {letters[answer.id]}
                            </h2>
                            <span>
                                {answer.value}
                            </span>
                        </button>
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
                        if(answer.color === 'white'){
                            failed = true
                        }
                        setItem('answers', i, 'color', 'green')
                        document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.remove('yellow', 'colored', 'white', 'red', 'green')
                        document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.add('green', 'colored')
                    } else {
                        if (answer.color === 'yellow') {
                            setItem('answers', i, 'color', 'red')
                            failed = true
                            document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.remove('yellow', 'colored', 'white', 'red', 'green')
                            document.getElementsByClassName('appAnswersWrapper')[0].children[i].classList.add('red', 'colored')
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
        }

        function saveItem(failed) {
            function extractAnswers() {
                let answers = []
                for (let i = 0; i < item.answers.length; i++) {
                    answers.push(JSON.parse(JSON.stringify(item.answers[i])))
                }
                return answers
            }

            const itemToAdd = {
                question: item.question,
                answers: extractAnswers(),
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
                    setUserInfo('history', res.data)
                    localStorage.setItem(staticConst.LOCAL_HISTORY_KEY, 0)
                    navigate('/score')
                } else {
                    window.location.reload()
                }
            })

        }

        return (
            <>
                <div className="appOtherContent">
                    <Show when={askConfirmation()[0]} fallback={
                        <>
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

    return (
        <>
            <div className={"appWrapper"}>
                <div className={"appScoreWrapper"}>
                    <Score />
                </div>
                <div className={"appQuestionWrapper"} style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Question />
                </div>
                <div className={"appAnswersWrapper"} style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Answers />
                </div>
                <div className={"appOtherWrapper"}>
                    <Other />
                </div>
            </div>
        </>
    )
}
