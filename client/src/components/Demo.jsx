import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

import styles from '../styles/score.module.scss'

import data from '../data/demo.json'

export default function Demo() {
    const [run, setRun] = createStore({
        questions: [],
        infos: {
            'score': [],
            'subjects': {}
        }
    })
    const [global, setGlobal] = createStore({
        round: 5,
        score: [0, 0],
        alreadyDone: [],
        state: 'app'
    })

    const [index, setIndex] = createSignal(0)
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
        console.log(data)
        setGlobal('alreadyDone', [...global.alreadyDone, index() + 1])
        setIndex(prev => prev + 1)
        return (formatItem(JSON.parse(JSON.stringify(data))[index() - 1]))
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
            let list = {
                'Chimie Général': ['Atomistique'],
                'Biochimie': ['Glucides'],
                'Biologie Moléculaire': ['ADN, Génome et Chromosomes'],
                'Biologie Cellulaire': ['La Cellule'],
                'Reproduction': ['Méiose, Gamètes et Reproduction']
            };

            setRun('questions', serieHistory)
            setRun('infos', 'score', global.score)
            setRun('infos', 'subjects', list)

            setGlobal('state', 'score')
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
        }

        // let inter;
        // function launchInter() {
        //     let i = 0
        //     inter = setInterval(() => {
        //         if (i > 3) {
        //             clearInterval(inter)
        //         }
        //         handleClick('answer', 1)
        //         submitAnswer()
        //         nextQuestion()
        //         i += 1
        //     }, 100);
        // }

        return (
            <>
                <div className="appOtherContent">
                    {/* <button onClick={() => launchInter()}>launch interval</button>
                    <button onClick={() => clearInterval(inter)}>stop interval</button> */}
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

    //////////////////////////////////////////////////////////////

    const [displayHistory, setDisplayHistory] = createSignal('all')

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
        let _item = JSON.parse(JSON.stringify(data)).find(__item => __item.id.toString() == elem.id.toString())
        if (ask === 'question') {
            return _item.question
        } else if (ask === 'answers') {
            let list = []
            for (let i = 0; i < 5; i++) {
                if (_item['answer' + i] !== '') {
                    function getColor() {
                        let color = 'white'
                        if (elem.selected.includes(i)) {
                            if (!_item.answer.toString().includes(i)) {
                                color = 'red'
                            }
                        }
                        if (_item.answer.toString().includes(i)) {
                            color = 'green'
                        }
                        return color
                    }
                    list = [...list, { color: getColor(), value: _item['answer' + i] }]
                }
            }
            return list
        }
    }

    function Format_Answer(props) {
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

    function Format_Question(props) {
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

    function getSubjectsMaxHeight() {
        return 19 + 24 * [...run.infos.subjects[Object.keys(run.infos.subjects)[0]]].length + 12 + 16 + "px"
    }

    return (
        <>
            <Show when={global.state === 'app'}>
                <div className={"appWrapper"}>
                    <div className={"appScoreWrapper"}>
                        <Score />
                    </div>
                    <div className={"appQuestionWrapper"}>
                        <Question />
                    </div>
                    <div className={"appAnswersWrapper"}>
                        <Answers />
                    </div>
                    <div className={"appOtherWrapper"}>
                        <Other />
                    </div>
                </div>
            </Show>
            <Show when={global.state === 'score'}>
                <div className={styles.scoreWrapper + ' ' + styles.demo}>
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
                                        <Format_Question question={getQuestion('question', each)} />
                                        <div className={styles.scoreHistoryItemAnswers}>
                                            <For each={getQuestion('answers', each)}>{(answer, i) =>
                                                <Format_Answer className={styles[answer.color] + ' ' + (each.selected.includes(i()) ? styles.selected : '')} answer={answer.value} />
                                            }</For>
                                        </div>
                                    </div>
                                </div>
                                }</For>
                        </div>
                    </div>
                    <button className={styles.other} onClick={() => { window.location.replace('/auth') }}>Faire une autre série</button>
                </div >
            </Show>
        </>
    )
}