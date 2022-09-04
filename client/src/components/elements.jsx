import { global } from "../globalInfo"

export function Template(props) {
    return (
        <>
            <div className={"overlay"}></div>
            <div className={"pageContent " + (props.addStyle)}>
                {props.children}
            </div>
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