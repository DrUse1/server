import { global, loading, setGlobal, staticConst, userInfo } from "../globalInfo"
import { Template } from "./elements"
import Header from "./Header"

export default function Success() {
    return (
        <>
            <Template addStyle="large-width full">
                <Header />
                <div style={{ transition: '.2s ease-in-out', filter: (loading() > 0 ? staticConst.blur : '') }}>
                    <Show when={userInfo.plan === 'premium'} fallback={
                        <div>Echec. Si tu viens de faire l'achat, réactualises la page dans 1 minute</div>
                    }>
                        <div>Successful, end date :</div>
                        <span>{userInfo.endDate.replaceAll('-', '/')}</span>
                    </Show>
                </div>
            </Template>
        </>
    )
}
