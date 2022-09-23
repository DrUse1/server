import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { global, loading, setLoading, showWarning, staticConst, userInfo } from "../globalInfo";
import Header from "./Header";

import styles from '../styles/terms.module.scss'
import Footer from "./Footer";

export default function Terms() {
    return (
        <>
            <Show when={userInfo.email !== ''}>
                <Header />
            </Show>
            <div className={styles.termsWrapper + (userInfo.email !== '' ? ' ' + styles.header : '')} style={{ filter: (loading() > 0 ? staticConst.blur : ''), '-webkit-filter': (loading() > 0 ? staticConst.blur : '') }}>
                <div className={styles.termsTitle}>
                    <span>Conditions Générales d'Utilisation 📃</span>
                </div>
                <div className={styles.termsContent}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>A propos de ces CGU</span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        L'accès et l’utilisation du Site, l’inscription sur le Site et la souscription à l’un des
                                        Services proposés par QCMED sur le Site sont soumis à votre acceptation sans réserve des
                                        présentes CGU.
                                    </p>
                                    <p>
                                        QCMED pourra suspendre toute inscription et le cas échéant résilier le compte de tout
                                        Utilisateur en cas de non-respect des CGU, sans préjudice de tous dommages et intérêts
                                        que pourrait solliciter QCMED.
                                    </p>
                                    <p>
                                        QCMED se réserve la possibilité de modifier et de mettre à jour les CGU du Site à tout
                                        moment. Les nouvelles CGU, qui vous seront notifiées sur le Site et/ou par l’intermédiaire
                                        de votre Compte, ne seront applicables qu’après leur entrée en vigueur. Vous devez vous
                                        référer avant toute utilisation du Site à la dernière version des CGU accessible à tout
                                        moment sur le Site à cette adresse.
                                    </p>
                                    <p>
                                        L'utilisation du Site sera soumise aux CGU en vigueur au moment de cette utilisation.
                                        Si vous n’acceptez pas les nouvelles CGU, Vous devrez cesser d’utiliser le Site et
                                        résilier votre Compte le cas échéant.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Accès au Site et aux Services </span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Création d’un Compte 💾
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        L'utilisation de nos service nécessite que vous créiez un compte.
                                        Pour créer un compte, Vous devez disposer d’une adresse électronique (e-mail) valide.
                                    </p>
                                    <p>
                                        Pour créer un compte, Vous devez disposer d’une adresse électronique (e-mail) valide.
                                        Vous pouvez à tout moment modifier les informations personnelles et le mot de passe dans l’onglet
                                        « Mon Compte » en haut à droite de votre écran (ou en bas à droite si vous êtes sur mobile).
                                    </p>
                                    <p>
                                        En cas d'oubli de votre mot de passe, Vous cliquerez sur « Mot de passe oublié » puis vous
                                        saisirez l'adresse de courrier électronique que vous avez indiquée lors de la création de votre Compte.
                                        Vous recevrez alors un courriel vous indiquant la procédure à suivre pour définir un nouveau mot de passe.
                                    </p>
                                    <p>
                                        Une fois inscrit(e), vous pourrez librement utiliser l'action dans sa version "limité". Cette version vous
                                        limite à {global.dailyLimit} séries de QCM par jour. Cette limite peut être retiré si vous prenez l'abonnement Premium.
                                    </p>
                                </span>
                            </div>
                        </div>

                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Confidentialité des identifiants de connexion et utilisation du Compte 🔐
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        Les éléments et données renseignés sur le compte sont strictement personnels et
                                        confidentiels.
                                    </p>
                                    <p>
                                        Vous vous engagez à conserver votre identifiant et votre mot de passe secrets et à
                                        ne pas les divulguer, pour quelque raison que ce soit, de quelque manière et sous
                                        quelque forme que ce soit, à des tiers.
                                    </p>
                                    <p>
                                        Si vos Identifiants de Connexion sont perdus ou volés, vous devez nous informer
                                        sans délai à l’adresse <strong><a href="mailto:support@qcmed.fr">support@qcmed.fr</a></strong>
                                        qui procédera  alors à l'annulation et/ou la mise à jour immédiate(s) des données du Compte.
                                    </p>
                                    <p>
                                        En aucun cas, nous saurons être tenue responsable de la perte ou du
                                        vol de vos Identifiants de Connexion ou de leur utilisation frauduleuse.
                                    </p>
                                    <p>
                                        Vous êtes
                                        seul responsable de l’utilisation de votre compte par des tiers et des actions ou
                                        déclarations faites par l’intermédiaire de celui-ci, qu’elles soient frauduleuses
                                        ou non.
                                    </p>
                                    <p>
                                        Vous nous garantissez contre toute demande à ce titre qui serait
                                        causée par une faute ou négligence de votre part.
                                    </p>
                                </span>
                            </div>
                        </div>

                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Configuration minimale de votre matériel informatique ⚙️
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        L’accès au Site nécessite que Vous disposiez d’un matériel informatique compatible
                                        (PC, Mac, smartphone, tablette…), d’une connexion internet et d’un navigateur web.
                                    </p>
                                    <p>
                                        Tous les coûts afférents à l'accès au Site et à son utilisation, que ce soient les
                                        frais matériels, logiciels ou d'accès à internet sont exclusivement à votre charge.
                                    </p>
                                    <p>
                                        Vous êtes seul responsable du bon fonctionnement de Votre équipement informatique
                                        ainsi que de Votre accès à internet.
                                    </p>
                                </span>
                            </div>
                        </div>

                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Disponibilité du Site
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        Le Site est accessible 24 heures sur 24, 7 jours sur 7, sous réserve de la
                                        survenance d’un cas de force majeure au sens de l’article 1218 du Code civil
                                        ou d’un événement hors du contrôle de notre Société et sous réserve d’une
                                        interruption, suspension ou limitation dans le cadre d’opérations de
                                        maintenance et/ou de mise à jour nécessaires au bon fonctionnement du
                                        Site ou pour toute autre raison, notamment technique.
                                    </p>
                                    <p>
                                        Nous sommes seulement tenue à une obligation de moyens concernant
                                        l’accessibilité, le fonctionnement et/ou la disponibilité du Site ou
                                        de ses contenus. Notre Société se réserve la possibilité d'interrompre,
                                        de suspendre ou de limiter l’accès à tout ou partie du Site ou de ses contenus,
                                        notamment en raison de contraintes d’ordre juridique, technique ou commerciale.
                                    </p>
                                    <p>
                                        Vous reconnaissez expressément que les interruptions, suspensions ou limitations susmentionnées
                                        pourront intervenir à tout moment, sans que vous ayez été préalablement averti, et qu’elle
                                        n'ouvriront droit à aucune obligation, ni indemnisation, à votre profit.
                                    </p>
                                    <p>
                                        Si le cas de force majeure ou l’événement interrompant la disponibilité du Site se poursuit
                                        pendant une période de plus de trente (30) jours, QCMED peut alors, de plein droit mettre fin
                                        aux CGU à tout moment. Il est expressément convenu que cette résiliation n'ouvre droit à aucune
                                        indemnité au profit de l'Utilisateur.
                                    </p>
                                    <p>
                                        Le Site ne s’adresse pas aux internautes situés hors de France métropolitaine et de ses territoires
                                        d’Outre-Mer. En effet, les législations, réglementations et pratiques applicables peuvent être
                                        différentes selon les pays.
                                    </p>
                                </span>
                            </div>
                        </div>

                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Services
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        QCMED propose un service d'entraînement à des QCM visant le domaine médical.
                                        Plus précisement, la première année de médecine.
                                    </p>
                                    <p>
                                        QCMED se réserve le droit d’adapter, de faire évoluer ou de supprimer
                                        certains Services sans que l’Utilisateur ne puisse s’en prévaloir.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Limites de nos services</span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Nos garanties
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        Sous réserve des dispositions légales impératives contraires, le Site est
                                        fourni « en l’état » et sans aucune autre garantie que celles visées au présent
                                        article.
                                    </p>
                                    <p>
                                        Dans le respect de la réglementation applicable, les informations diffusées
                                        sur le Site sont fournies par notre Société à titre strictement et
                                        exclusivement informatif et indicatif.
                                    </p>
                                    <p>
                                        Nous faisons de notre mieux pour maintenir le Site à jour et
                                        diffuser des informations fiables et licites. Cependant, malgré tout
                                        le soin et l’attention apportés à la sélection des sources et à la
                                        rédaction des contenus et informations, notre Société ne saurait pour
                                        autant garantir l’intégrité, l'exactitude, l'exhaustivité, l’actualité
                                        ou autre qualité des informations diffusées sur le Site.
                                    </p>
                                    <p>
                                        L’accès au Site implique la connaissance et l’acceptation des caractéristiques
                                        et des limites d’internet, notamment en ce qui concerne les performances techniques,
                                        les temps de réponse pour consulter, interroger ou transférer des informations,
                                        les risques d’interruption, et plus généralement, les risques inhérents à
                                        toute connexion et transmission sur internet, l’absence de protection de
                                        certaines données contre des détournements éventuels et les risques de
                                        contamination par d’éventuels virus circulant sur le réseau.
                                    </p>
                                    <p>
                                        Il Vous appartient
                                        en conséquence de prendre toutes les mesures appropriées de façon à protéger
                                        vos propres matériels, données et/ou logiciels stockés sur votre équipement
                                        informatique, ainsi que les informations que vous communiquez sur le Site,
                                        contre toute atteinte et d’en assurer des sauvegardes régulières.
                                    </p>
                                    <p>
                                        Notre Société assure la maintenance évolutive du Site. Il n’existe aucun droit
                                        au maintien de versions antérieures du Site ou à une quelconque maintenance curative.
                                    </p>
                                    <p>
                                        Vous êtes seul maître de la bonne utilisation du Site. Aucun conseil et aucune
                                        information, qu'ils soient oraux ou écrits, obtenus lors de votre utilisation
                                        du Site ne sont susceptibles de créer de garanties non expressément prévues
                                        par les CGU et/ou la loi applicable.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Notre relation</span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Notre responsabilité
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        La responsabilité de notre Société ne saurait être engagée, d’une façon générale,
                                        dans tous les cas où l'inexécution ou la mauvaise exécution de ses prestations et/ou
                                        obligations résulterait d'un cas de force majeure au sens de l’article 1218 du Code
                                        civil ou cas fortuit indépendant de sa volonté ou d’une faute de votre part dans
                                        la mesure de la loi et de la jurisprudence applicable.
                                    </p>
                                    <p>
                                        Notre Société ne saurait être tenue responsable de l’altération, de la perte,
                                        de la destruction ou de la transmission de données, ou de tout dommage affectant
                                        le matériel ou le système informatique de l’Utilisateur ou d’un tiers et qui
                                        résulterait de la navigation sur ou de l’utilisation du Site, ou de l’envoi de
                                        virus via les contenus du site provenant de tiers.
                                    </p>
                                </span>
                            </div>
                        </div>

                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Votre responsabilité
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        Chaque Utilisateur s'engage à utiliser le Site de bonne foi et à ne pas faire un
                                        usage du Site qui serait contraire aux lois ou aux règlements sous peine d'engager
                                        sa responsabilité.
                                    </p>
                                    <p>
                                        Tout Utilisateur s'interdit tout usage du Site qui serait susceptible de porter
                                        atteinte aux droits de QCMED ou qui serait susceptible de causer un dommage à
                                        QCMED et à ses partenaires. Tout utilisateur s'interdit tout usage du Site qui
                                        serait de nature à porter atteinte à l'intégrité de l'infrastructure technique
                                        de QCMED, notamment ses serveurs informatiques.
                                    </p>
                                    <p>
                                        L’utilisateur est seul responsable des informations qu’il renseigne ou communique
                                        via le Site et s’engage à les mettre à jour lorsque c’est nécessaire.
                                    </p>
                                    <p>
                                        L’utilisateur s’engage par ailleurs à ne faire qu’un usage strictement privé
                                        du Site et des Services mis à sa disposition.
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Confidentialité</span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Comment nous utilisons et protégeons vos données personnelles
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    <p>
                                        Les données que vous nous partagez ne sont divulguées à personne (promis).
                                    </p>
                                    <p>
                                        Toutes vos informations personnelles sont stockés dans une base de données
                                        sécurisé et votre mot de passe ne nous est jamais révélé car crypté 😉
                                    </p>
                                    <p>
                                        Donc n'ayez pas peur de mettre un mot de passe que vous utiliser souvent
                                        (même si on vous le déconseille !)
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <span>Comment nous contacter ?</span>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Directement sur le site
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    Nous vous proposons un système de contact directement sur notre
                                    site en cliquant sur le lien se trouvant tout en bas de la page
                                    (là où vous avez trouver ces CGU 😉)
                                </span>
                            </div>
                        </div>
                        <div className={styles.article}>
                            <div className={styles.title}>
                                <span>
                                    Par mail
                                </span>
                            </div>
                            <div className={styles.content}>
                                <span>
                                    Vous pouvez directement nous contacter sur le mail
                                    suivant : <a href="mailto:support@qcmed.fr">support@qcmed.fr</a>.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer style={userInfo.email !== '' ? 'header' : ''} />
        </>
    )
}
