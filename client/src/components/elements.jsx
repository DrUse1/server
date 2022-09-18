import { global } from "../globalInfo"

import dna from '../svg/subjects/dna.png'
import atom from '../svg/subjects/atom.png'
import flask from '../svg/subjects/flask.png'
import chemistry from '../svg/subjects/chemistry.png'
import cells from '../svg/subjects/cells.png'
import cell from '../svg/subjects/cell.png'
import embryo from '../svg/subjects/embryo.png'
import anatomie from '../svg/subjects/anatomie.png'
import reproduction from '../svg/subjects/reproduction.png'
import veins from '../svg/subjects/veins.png'
import capsule from '../svg/subjects/capsule.png'
import ssh from '../svg/subjects/ssh.png'
import stats from '../svg/subjects/stats.png'


export function SubjectIcon(props) {
    const map = {
        'Chimie Général': <img src={atom} alt={props.subject} />,
        'Biochimie': <img src={chemistry} alt={props.subject} />,
        'Biologie Moléculaire': <img src={dna} alt={props.subject} />,
        'Biologie Cellulaire': <img src={cells} alt={props.subject} />,
        'Histologie': <img src={cell} alt={props.subject} />,
        'Embryologie': <img src={embryo} alt={props.subject} />,
        'Reproduction': <img src={reproduction} alt={props.subject} />,
        'BioPhy-Physio': <img src={veins} alt={props.subject} />,
        'Anatomie': <img src={anatomie} alt={props.subject} />,
        'Pharmacologie': <img src={capsule} alt={props.subject} />,
        'SSH': <img src={ssh} alt={props.subject} />,
        'Biostatistique': <img src={stats} alt={props.subject} />,
    }
    return (
        <>
            {map[props.subject]}
        </>
    )
}

export function WarningPopup() {
    return (
        <>
            <div className={"warningPopup"}>
                <div className={'warningContent' + (global.showWarning.state ? ' active' : '')}>
                    <h3 className={global.showWarning.type}>{global.showWarning.msg}</h3>
                </div>
            </div>
        </>
    )
}