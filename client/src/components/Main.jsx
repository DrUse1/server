import { createSignal, For } from "solid-js";

import { staticConst, global, setGlobal, subjects, setSubjects, showWarning, userInfo, getChapters, loading } from '../globalInfo'

import examIcon from '../svg/exam.svg'
import subjectsIcon from '../svg/subjects.svg'
import trainIcon from '../svg/train.svg'
import crossIcon from '../svg/cross.svg'
import neutralCheckIcon from '../svg/neutralCheck.svg'

import { useNavigate } from "@solidjs/router";
import Header from "./Header";
import Footer from "./Footer";
import { SubjectIcon } from "./elements";

export default function Main() {
    const navigate = useNavigate();

    const [toggleSubjects, setToggleSubjects] = createSignal(false)
    const [limitHistory, setLimitHistory] = createSignal(3)

    function handleClick(type) {
        if (getChapters('selected').length === 0) {
            showWarning('Tu dois préciser au moins un chapitre !')
        } else {
            if (userInfo.numPlays >= global.dailyLimit && userInfo.plan === 'basic') {
                showWarning("Tu as atteint la limite de tes séries journalières")
            } else {
                navigate('/app');
                setGlobal('state', type)
            }
        }
    }

    function toggleSessionSubject() {
        if (toggleSubjects()) {
            document.getElementsByClassName("overlay")[0].classList.remove('active')
            setToggleSubjects(false)
        } else {
            document.getElementsByClassName("overlay")[0].classList.add('active')
            setToggleSubjects(true)
        }
    }

    function toggleAllChapters() {
        let newValue;
        if (getChapters('unselected').length === 0) {
            newValue = false
        } else {
            newValue = true
        }
        Object.keys(subjects).forEach(subject => {
            Object.keys(subjects[subject]).forEach(chapter => {
                setSubjects(subject, chapter, newValue)
            })
        })
        localStorage.setItem(staticConst.LOCAL_SUBJECT_KEY, JSON.stringify(subjects))
        var elements = document.getElementsByClassName('toBeChecked')
        for (let i = 0; i < elements.length; i++) {
            elements[i].checked = newValue
        }
    }

    function toggleChapters(subject) {
        let newValue;
        if (Object.values(subjects[subject]).includes(false)) {
            newValue = true
        } else {
            newValue = false
        }
        Object.keys(subjects[subject]).forEach(chapter => {
            setSubjects(subject, chapter, newValue)
        })
        localStorage.setItem(staticConst.LOCAL_SUBJECT_KEY, JSON.stringify(subjects))
        var elements = document.getElementsByClassName('toBeChecked ' + subject)
        for (let i = 0; i < elements.length; i++) {
            elements[i].checked = newValue
        }
    }

    function toggleChapter(chapter, subject) {
        let newValue;
        if (subjects[subject][chapter] === true) {
            newValue = false
        } else {
            newValue = true
        }
        setSubjects(subject, chapter, newValue)
        localStorage.setItem(staticConst.LOCAL_SUBJECT_KEY, JSON.stringify(subjects))
        var elements = document.getElementsByClassName('mainSubjectToBeChecked ' + subject)
        for (let i = 0; i < elements.length; i++) {
            if (newValue === false) {
                elements[i].checked = newValue
            } else if (!Object.values(subjects[subject]).includes(false)) {
                elements[i].checked = newValue
            }
        }
    }

    function getScoreColor(h) {
        if (h.score[0] >= h.score[1] * (3 / 4)) {
            return 'green'
        } else if (h.score[0] >= h.score[1] * (2 / 4)) {
            return ''
        }
        return 'red'
    }

    function calculateAverage() {
        let sum = 0
        let len = 0
        userInfo.history.forEach(each => {
            sum += each.infos.score[0] / each.infos.score[1]
            len++
        })
        return (sum / len)
    }

    document.getElementById('overlay').addEventListener('click', () => {
        if (toggleSubjects()) {
            toggleSessionSubject()
        }
    })

    return (
        <>
            <div className={"subjectWrapper" + (toggleSubjects() ? ' active' : '')}>
                <div className={"subjectHeader"}>
                    <div className={"subjectTitle"}>
                        <h2>Spécifies les chapitres</h2>
                    </div>
                    <div className={"closeButton"}>
                        <button onClick={() => toggleSessionSubject()}>
                            <img src={crossIcon} alt="crossIcon" />
                        </button>
                    </div>
                </div>
                <div className={"subjectBody"}>
                    <div className={"subjectDescription"}>
                        <p>Spécifies les chapitres sur lesquels tu veux tomber lors de tes séries !</p>
                        <p>Cliques sur la matière pour spécifier les chapitres !</p>
                        <p>(De nombreuses questions sont encore à venir !)</p>
                    </div>
                    <div className={"subjectSelectAll"}>
                        <p>Tout sélectionner</p>
                        <div className={"subjectSwitch"}>
                            <label className="switch">
                                <input className="toBeChecked mainToBeChecked" type="checkbox" checked={getChapters('unselected').length === 0} onChange={() => { toggleAllChapters() }} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className={"subjectList"}>
                        <For each={Object.keys(subjects)}>
                            {subject =>
                                <div className={"subject"}>
                                    <div className="subjectContainer" onClick={() => {
                                        if (document.getElementsByClassName('chapterContainer ' + subject)[0].className.includes('show')) {
                                            document.getElementsByClassName('chapterContainer ' + subject)[0].classList.remove('show')
                                            document.getElementsByClassName('subjectArrowIcon ' + subject)[0].classList.remove('show')
                                        } else {
                                            document.getElementsByClassName('chapterContainer ' + subject)[0].classList.add('show')
                                            document.getElementsByClassName('subjectArrowIcon ' + subject)[0].classList.add('show')
                                        }
                                    }}>
                                        <div className={"subjectIcon"}>
                                            <SubjectIcon subject={subject} />
                                        </div>
                                        <div className={"subjectArrowIcon " + subject}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                            </svg>
                                        </div>
                                        <div className={"subjectName"}>
                                            <span>{subject[0].toUpperCase() + subject.slice(1)}</span>
                                        </div>
                                        <div className={"subjectSwitch"} style={{ 'transform': 'scale(0.9)', 'position': 'relative', 'right': '-2px' }}>
                                            <label className="switch">
                                                <input className={"toBeChecked mainSubjectToBeChecked " + subject} type="checkbox" checked={!Object.values(subjects[subject]).includes(false)} onChange={() => toggleChapters(subject)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className={"chapterContainer " + subject} style={"--data-chapters:" + Object.keys(subjects[subject]).length}>
                                        <For each={Object.keys(subjects[subject])}>
                                            {chapter =>
                                                <div className="chapter">
                                                    <div className={"subjectName"} style={{ 'margin-left': '8px' }}>
                                                        <span>{chapter[0].toUpperCase() + chapter.slice(1)}</span>
                                                    </div>
                                                    <div className={"subjectSwitch"} style={{ 'transform': 'scale(0.8)', 'position': 'relative', 'right': '-5px' }}>
                                                        <label className="switch">
                                                            <input className={"toBeChecked " + subject} type="checkbox" checked={subjects[subject][chapter]} onChange={() => toggleChapter(chapter, subject)} />
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            }
                                        </For>
                                    </div>
                                </div>
                            }
                        </For>
                    </div>
                </div>
            </div>
            <div className="mainPage">
                <Header />
                <div className="mainWrapper" id="mainWrapper" style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={userInfo.plan === 'basic'}>
                        <div className="progressBarWrapper">
                            <div className="progressBarHeader">
                                <h3>Séries journalières {userInfo.numPlays}/{global.dailyLimit}</h3>
                                <button onClick={() => navigate('/plan')}>
                                    <span>Augmenter la limite</span>
                                </button>
                            </div>
                            <div className="bgProgressBar">
                                <div className="progressBar" style={{
                                    'width': (userInfo.numPlays / global.dailyLimit * 100) + '%',
                                    'transition': '.5s ease-in-out'
                                }} />
                            </div>
                        </div>
                    </Show>
                    <h2>Lancer une série</h2>
                    <div className={"sessionWrapper"}>
                        <button className={"session"} onClick={() => handleClick('train')}>
                            <div className={"sessionContent"}>
                                <div className={"sessionIconWrapper"}>
                                    <img className={"icon"} src={trainIcon} alt="trainIcon" />
                                </div>
                                <div className={"sessionLabel"}>
                                    <div>
                                        <h2>Entraînement</h2>
                                        <div className={"desktopSessionArrowIconWrapper"}>
                                            <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div><p>10 questions avec correction</p></div>
                                </div>
                                <div className={"sessionArrowIconWrapper"}>
                                    <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                    </svg>
                                </div>
                            </div>
                        </button>
                        <button className={"session"} onClick={() => toggleSessionSubject()}>
                            <div className={"sessionContent"}>
                                <div className={"sessionIconWrapper"}>
                                    <img className={"icon"} src={subjectsIcon} alt="subjectsIcon" />
                                </div>
                                <div className={"sessionLabel"}>
                                    <div>
                                        <h2>Chapitres</h2>
                                        <div className={"desktopSessionArrowIconWrapper"}>
                                            <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Spécifier les chapitres</p>
                                    </div>
                                </div>
                                <div className={"sessionArrowIconWrapper"}>
                                    <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                    </svg>
                                </div>
                            </div>
                        </button>
                        <button className={"session"} onClick={() => handleClick('exam')}>
                            <div className={"sessionContent"}>
                                <div className={"sessionIconWrapper"}>
                                    <img className={"icon"} src={examIcon} alt="examIcon" />
                                </div>
                                <div className={"sessionLabel"}>
                                    <div>
                                        <h2>Examen</h2>
                                        <div className={"desktopSessionArrowIconWrapper"}>
                                            <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p>10 questions sans correction</p>
                                    </div>
                                </div>
                                <div className={"sessionArrowIconWrapper"}>
                                    <svg className={"sessionArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </div>
                    <h2>Dernières séries</h2>
                    <div className={"historyWrapper"}>
                        <Show when={userInfo.history.length > 0} fallback={
                            <h2>Tu n'as fait aucune série pour l'instant</h2>
                        }>
                            <For each={userInfo.history}>{(h, i) =>
                                <Show when={i() < limitHistory()}>
                                    <button onClick={() => { localStorage.setItem(staticConst.LOCAL_HISTORY_KEY, i()); navigate('/score') }}
                                        className={"historyItem"}
                                        data-score={getScoreColor(h.infos)}
                                        data-color={['red', 'green'].includes(getScoreColor(h.infos)) ? 'colored' : ''}>
                                        <div className={"historyContent"}>
                                            <div className={"historyCheckIconWrapper"}>
                                                <div className={"historyCheckIconContainer"}>
                                                    <Show when={getScoreColor(h.infos) === 'green'}>
                                                        <svg className={"historyCheckIcon"} xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"><path fill="currentColor"
                                                                d="M2.707 10.293a1 1 0 00-1.414 1.414l5 5a1 1
                                                0 001.414 0l11-11a1 1 0 10-1.414-1.414L7 14.586l-4.293-4.293z">
                                                            </path>
                                                        </svg>
                                                    </Show>
                                                    <Show when={getScoreColor(h.infos) === ''}>
                                                        <img src={neutralCheckIcon} alt="neutralCheckIcon" />
                                                    </Show>
                                                    <Show when={getScoreColor(h.infos) === 'red'}>
                                                        <svg className={"historyCheckIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M15.293 3.293l-12 12a1 1 0 001.414 1.414l12-12a1 1 0 10-1.414-1.414z"></path>
                                                            <path d="M3.293 4.707l12 12a1 1 0 001.414-1.414l-12-12a1 1 0 00-1.414 1.414z"></path>
                                                        </svg>
                                                    </Show>
                                                </div>
                                            </div>
                                            <div className={"historyLabel"}>
                                                <div>
                                                    <h2>{h.infos.score[0]}/{h.infos.score[1]}</h2>
                                                </div>
                                                <div>
                                                    <p>Série d'{h.infos.type === 'train' ? 'entraînement' : 'examen'}</p>
                                                </div>
                                            </div>
                                            <div className={"historyArrowIconWrapper"}>
                                                <svg className={"historyArrowIcon"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path fill="currentColor" d="M11.586 10L6.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </button>
                                </Show>
                            }</For>
                            <Show when={userInfo.history.length > limitHistory()}>
                                <button className={"historySeeMore"} onClick={() => setLimitHistory(prev => prev + 3)}>
                                    <span>Voir plus</span>
                                </button>
                            </Show>
                        </Show>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
