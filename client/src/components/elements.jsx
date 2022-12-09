import { global } from "../globalInfo"

import dna from '../svg/subjects/dna.png'
import atom from '../svg/subjects/atom.png'
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
import biophysique from '../svg/subjects/biophysique.png'
import sante_env from '../svg/subjects/environnement.png'
import sante_num from '../svg/subjects/sante-num.png'
import genetic from '../svg/subjects/genetic.png'
import ethic from '../svg/subjects/ethique.png'


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
        'Physiologie': <img src={veins} alt={props.subject} />,
        'Anatomie': <img src={anatomie} alt={props.subject} />,
        'Pharmacologie': <img src={capsule} alt={props.subject} />,
        'SSH': <img src={ssh} alt={props.subject} />,
        'Biostatistique': <img src={stats} alt={props.subject} />,
        'Chimie': <img src={atom} alt={props.subject} />,
        'BioPhysique': <img src={biophysique} alt={props.subject} />,
        'Santé Environnementale': <img src={sante_env} alt={props.subject} />,
        'Santé Numérique': <img src={sante_num} alt={props.subject} />,
        'Génétique': <img src={genetic} alt={props.subject} />,
        'Ethique': <img src={ethic} alt={props.subject} />,
        'BDR': <img src={reproduction} alt={props.subject} />,
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

export function LogoFull(props) {
    props.color = (props.color == undefined ? 'black' : props.color)
    props.color = (props.color == 'darkerBlue' ? '#0782DA' : props.color)

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="14.899 54.147 488.437 96.065" height="100%">
            <g transform="matrix(1.619772, 0, 0, 1.619772, -129.958328, -70.331741)">
                <g transform="matrix(0.011522, 0, 0, -0.011522, 80.373222, 135.477737)" fill={props.color} stroke="none">
                    <g transform="matrix(11.458947, -11.458947, -32.685356, -32.685356, 11297.347656, 7817.227539)">
                        <rect x="60.232" y="159.53" width="123.73" height="14.528" style={`stroke: ${props.color};`} />
                        <ellipse style={`stroke: ${props.color};`} cx="183.003" cy="166.772" rx="17.095" ry="7.262" />
                        <ellipse style={`stroke: ${props.color};`} cx="58.667" cy="166.821" rx="18.372" ry="7.262" />
                    </g>
                    <path d="M 1331.573 5074.953 C 1241.573 5053.953 1138.573 4984.953 1084.573 4908.953 C 1056.573 4870.953 1047.573 4864.953 1025.573 4868.953 C 950.573 4883.953 853.573 4830.953 811.573 4752.953 L 789.573 4710.953 L 786.573 3845.953 C 783.573 2969.953 788.573 2807.953 820.573 2680.953 C 931.573 2242.953 1322.573 1871.953 1815.573 1735.953 C 1873.573 1720.953 2041.573 1685.953 2062.573 1685.953 C 2063.573 1685.953 2064.573 1585.953 2064.573 1463.953 C 2065.573 1067.953 2078.888 912.11 2187.888 704.11 C 2252.888 579.11 2387.344 383.461 2525.045 282.582 C 2907.873 2.125 3238.587 -64.382 3687.841 -5.446 C 3846.955 15.428 4554.914 111.693 4661.133 762.346 C 4710.533 1064.946 4308.272 1234.503 4297.762 1095.098 C 4256.447 547.11 3924.959 478.915 3624.732 424.748 C 3419.904 387.793 3234.573 416.953 3056.573 493.953 C 2828.573 592.953 2614.573 796.953 2544.573 981.953 C 2501.573 1096.953 2494.573 1162.953 2494.573 1431.953 C 2494.573 1571.953 2495.573 1685.953 2497.573 1685.953 C 2498.573 1685.953 2537.573 1692.953 2584.573 1700.953 C 2704.573 1721.953 2844.573 1762.953 2944.573 1804.953 C 3305.573 1958.953 3602.573 2258.953 3712.573 2580.953 C 3770.573 2750.953 3768.573 2709.953 3772.573 3735.953 C 3774.573 4416.953 3772.573 4691.953 3764.573 4718.953 C 3749.573 4769.953 3682.573 4841.953 3636.573 4856.953 C 3616.573 4863.953 3579.573 4868.953 3553.573 4869.953 C 3510.573 4870.953 3504.573 4873.953 3472.573 4915.953 C 3428.573 4973.953 3353.573 5030.953 3284.573 5057.953 C 3206.573 5088.953 3063.573 5087.953 2981.573 5056.953 C 2877.573 5015.953 2762.573 4899.953 2734.573 4805.953 C 2684.573 4644.953 2717.573 4486.953 2821.573 4374.953 C 2957.573 4228.953 3133.573 4196.953 3327.573 4280.953 C 3344.573 4287.953 3345.573 4255.953 3342.573 3544.953 L 3339.573 2800.953 L 3312.573 2727.953 C 3250.573 2555.953 3124.573 2405.953 2946.573 2288.953 C 2784.573 2181.953 2613.573 2124.953 2397.573 2106.953 C 1861.573 2059.953 1376.573 2332.953 1240.573 2755.953 C 1220.573 2818.953 1219.573 2843.953 1216.573 3554.953 C 1213.573 4255.953 1214.573 4287.953 1231.573 4280.953 C 1423.573 4200.953 1597.573 4228.953 1727.573 4359.953 C 1895.573 4530.953 1893.573 4796.953 1722.573 4962.953 C 1617.573 5063.953 1468.573 5106.953 1331.573 5074.953 Z" style="stroke-width: 520.743px;" />
                    <ellipse style={`stroke: ${props.color}; stroke-width: 810.635px; paint-order: fill; fill-opacity: 0; fill-rule: evenodd;`} transform="matrix(1, 0, 0, -1, 0, 0)" cx="5957.239" cy="-2296.825" rx="1746.336" ry="1917.858" />
                </g>
                <path fill={props.color} d="M 215.813 115.714 L 226.198 119.007 Q 223.81 127.69 218.256 131.905 Q 212.702 136.121 204.163 136.121 Q 193.598 136.121 186.796 128.902 Q 179.994 121.684 179.994 109.165 Q 179.994 95.923 186.832 88.596 Q 193.67 81.269 204.814 81.269 Q 214.547 81.269 220.626 87.022 Q 224.244 90.423 226.053 96.791 L 215.452 99.324 Q 214.511 95.199 211.526 92.811 Q 208.541 90.423 204.271 90.423 Q 198.374 90.423 194.701 94.656 Q 191.029 98.89 191.029 108.369 Q 191.029 118.428 194.647 122.697 Q 198.265 126.967 204.054 126.967 Q 208.324 126.967 211.399 124.253 Q 214.475 121.539 215.813 115.714 Z M 235.241 135.216 L 235.241 82.174 L 251.269 82.174 L 260.893 118.355 L 270.409 82.174 L 286.474 82.174 L 286.474 135.216 L 276.524 135.216 L 276.524 93.462 L 265.995 135.216 L 255.683 135.216 L 245.191 93.462 L 245.191 135.216 Z M 297.105 135.216 L 297.105 82.174 L 336.435 82.174 L 336.435 91.147 L 307.815 91.147 L 307.815 102.906 L 334.445 102.906 L 334.445 111.843 L 307.815 111.843 L 307.815 126.279 L 337.448 126.279 L 337.448 135.216 Z M 346.499 82.174 L 366.073 82.174 Q 372.694 82.174 376.168 83.187 Q 380.835 84.562 384.164 88.071 Q 387.493 91.581 389.229 96.664 Q 390.966 101.748 390.966 109.201 Q 390.966 115.75 389.338 120.49 Q 387.348 126.279 383.657 129.861 Q 380.871 132.575 376.131 134.094 Q 372.586 135.216 366.652 135.216 L 346.499 135.216 Z M 357.208 91.147 L 357.208 126.279 L 365.205 126.279 Q 369.691 126.279 371.681 125.773 Q 374.286 125.121 376.005 123.566 Q 377.723 122.01 378.809 118.446 Q 379.894 114.882 379.894 108.731 Q 379.894 102.58 378.809 99.288 Q 377.723 95.995 375.77 94.15 Q 373.816 92.305 370.813 91.653 Q 368.57 91.147 362.021 91.147 Z" style="white-space: pre;" />
            </g>
        </svg>
    )
}