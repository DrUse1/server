import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { loading, setLoading, showWarning, staticConst, userInfo } from "../globalInfo";
import Header from "./Header";

import styles from '../styles/terms.module.scss'
import Footer from "./Footer";

export default function Terms() {
    return (
        <>
            <Show when={userInfo.email !== ''}>
                <Header />
            </Show>
            <div className={styles.termsWrapper}>
                <div className={styles.termsTitle}>
                    <span>Conditions Générales d'Utilisation</span>
                </div>
                <div className={styles.termsContent}>
                    <div className={styles.article}>
                    <div className={styles.title}>
                            <span>A propos de ces CGU</span>
                        </div>
                        <div className={styles.content}>
                            <span>A propos de ces CGU</span>
                        </div>
                    </div>

L'accès et l’utilisation du Site, l’inscription sur le Site et la souscription à l’un des Services proposés par QCMED sur le Site sont soumis à votre acceptation sans réserve des présentes CGU. 

D’où l’intérêt de bien les lire! 

QCMED pourra suspendre toute inscription et le cas échéant résilier le compte de tout Utilisateur en cas de non-respect des CGU, sans préjudice de tous dommages et intérêts que pourrait solliciter QCMED.

QCMED se réserve la possibilité de modifier et de mettre à jour les CGU du Site à tout moment. Les nouvelles CGU, qui vous seront notifiées sur le Site et/ou par l’intermédiaire de votre Compte, ne seront applicables qu’après leur entrée en vigueur. Vous devez vous référer avant toute utilisation du Site à la dernière version des CGU accessible à tout moment sur le Site à l’adresse suivante : https://www.QCMED.com/a-propos/conditions-generales-d-utilisation. 

L'utilisation du Site sera soumise aux CGU en vigueur au moment de cette utilisation. Si vous n’acceptez pas les nouvelles CGU, Vous devrez cesser d’utiliser le Site et résilier votre Compte le cas échéant.

Accès au Site et aux Services 🛤
Création d’un Compte
La souscription à l'un des Service sur le Site nécessite que Vous créiez un Compte. Pour créer un Compte, Vous devez disposer d’une adresse électronique (e-mail) valide. 

Il est à noter que deux Comptes indépendants vous seront nécessaires pour souscrire aux Services Education et Assurance.

Vous acceptez de fournir et de maintenir les informations suivantes vous concernant exactes, à jour et complètes : prénom, nom, date de naissance, adresse, code postal, numéro de téléphone, adresse mail, mot de passe, etc. (ci-après vos « Données d’Identification »). A ce titre, vous pouvez à tout moment modifier ces informations et le mot de passe dans l’onglet « Mon compte », puis « Compte ». 

En cas d'oubli de votre mot de passe, Vous cliquerez sur « J’ai oublié mon mot de passe » puis Vous saisirez l'adresse de courrier électronique que Vous avez indiquée lors de la création de votre Compte. Vous recevrez alors un courriel vous indiquant la procédure à suivre pour définir un nouveau mot de passe.

Une fois inscrit(e), Vous pourrez acheter les produits et/ou Services proposés à la vente sur le Site dans les conditions et modalités prévues dans nos conditions générales de vente, que nous vous invitons à lire attentivement à l’adresse suivante : https://www.QCMED.com/articles/conditions-generales-de-vente.

Dans l'hypothèse où l’Utilisateur serait une personne physique mineure ou protégée, il déclare et reconnaît avoir recueilli l'autorisation auprès de ses parents ou du/des titulaire(s) de l'autorité parentale ou de son tuteur, lesquels acceptent d'être garants du respect de l'ensemble des dispositions des présentes CGU, et responsables de l'utilisation faite par l’Utilisateur des contenus et Services, conscients que les informations présentes sur le Site sont destinées à toucher un large public.

Confidentialité des identifiants de connexion et utilisation du Compte
Les éléments et données renseignés sur le Compte sont strictement personnels et confidentiels. Vous vous engagez à conserver votre identifiant et votre mot de passe (ci-après vos « Identifiants de Connexion ») secrets et à ne pas les divulguer, pour quelque raison que ce soit, de quelque manière et sous quelque forme que ce soit, à des tiers. Si vos Identifiants de Connexion sont perdus ou volés, Vous devez informer sans délai notre Société par courriel à l’adresse hello@QCMED.com pour la partie Education et à l’adresse assurance@QCMED.com pour la partie Assurance, qui procédera alors à l'annulation et/ou la mise à jour immédiate(s) des données du Compte. 

En aucun cas, notre Société ne saurait être tenue responsable de la perte ou du vol de vos Identifiants de Connexion ou de leur utilisation frauduleuse. Vous êtes seul responsable de l’utilisation de votre Compte par des tiers et des actions ou déclarations faites par l’intermédiaire de celui-ci, qu’elles soient frauduleuses ou non. Vous garantissez notre Société contre toute demande à ce titre qui serait causée par une faute ou négligence de votre part.

Le traitement et l'utilisation de vos Données d’Identification (prénom, nom, numéro de téléphone, adresse email, etc.) est décrit dans la Politique de Confidentialité conformément à l’article 7 des présentes CGU.

Si Vous le souhaitez, Vous pouvez vous inscrire sur la liste d'opposition au démarchage téléphonique proposée par Bloctel sur leur site. Conformément à l’article L. 223-1 du Code de la consommation, l'inscription à ce service est gratuite pour les consommateurs.

Configuration minimale de votre matériel informatique
L’accès au Site nécessite que Vous disposiez d’un matériel informatique compatible (PC, Mac, smartphone, tablette…), d’une connexion internet et d’un navigateur web. 

Tous les coûts afférents à l'accès au Site et à son utilisation, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à votre charge. Vous êtes seul responsable du bon fonctionnement de Votre équipement informatique ainsi que de Votre accès à internet.

Disponibilité du Site
Le Site est accessible 24 heures sur 24, 7 jours sur 7, sous réserve de la survenance d’un cas de force majeure au sens de l’article 1218 du Code civil ou d’un événement hors du contrôle de notre Société et sous réserve d’une interruption, suspension ou limitation dans le cadre d’opérations de maintenance et/ou de mise à jour nécessaires au bon fonctionnement du Site ou pour toute autre raison, notamment technique.

Notre Société est seulement tenue à une obligation de moyens concernant l’accessibilité, le fonctionnement et/ou la disponibilité du Site ou de ses contenus. Notre Société se réserve la possibilité d'interrompre, de suspendre ou de limiter l’accès à tout ou partie du Site ou de ses contenus, notamment en raison de contraintes d’ordre juridique, technique ou commerciale.

Vous reconnaissez expressément que les interruptions, suspensions ou limitations susmentionnées pourront intervenir à tout moment, sans que vous ayez été préalablement averti, et qu’elles n'ouvriront droit à aucune obligation, ni indemnisation, à votre profit.

Si le cas de force majeure ou l’événement interrompant la disponibilité du Site se poursuit pendant une période de plus de trente (30) jours, QCMED peut alors, de plein droit mettre fin aux CGU à tout moment. Il est expressément convenu que cette résiliation n'ouvre droit à aucune indemnité au profit de l'Utilisateur. 

Le Site ne s’adresse pas aux internautes situés hors de France métropolitaine et de ses territoires d’Outre-Mer. En effet, les législations, réglementations et pratiques applicables à l’Education et à l’Assurance peuvent être différentes selon les pays.

Services
Comme expliqué plus haut, QCMED propose deux types de Services payants :

Un Service Education vous permettant de :

réviser l’Examen Théorique Général (ETG) du code via des contenus pédagogiques présentés sous la forme de séries de questions avec leur correction afin de suivre votre progression pas à pas,
réserver votre session d’examen du Code de la route via notre Site,
réserver des leçons de conduite en fonction de vos besoins.
Un service Assurance vous donnant l’opportunité de :

réaliser un devis et/ou souscrire simplement votre assurance automobile, 
échanger avec un conseiller par chat ou téléphone, 
obtenir un coaching psychologique après un accident, 
bénéficier d’un accompagnement pour l’entretien de votre véhicule, 
importer et consulter facilement vos documents et justificatifs en ligne.
Vous pouvez accéder à ces Services, après souscription, via le Site. Pour certains Services, nous travaillons avec des partenaires qui vous fourniront directement ce Service et qui vous rendront opposables leurs propres conditions d’utilisation.

QCMED se réserve le droit d’adapter, de faire évoluer ou de supprimer certains Services sans que l’Utilisateur ne puisse s’en prévaloir.

Limites de nos services ⛔️
Nos garanties

Sous réserve des dispositions légales impératives contraires, le Site est fourni « en l’état » et sans aucune autre garantie que celles visées au présent article. 

Dans le respect de la réglementation applicable, les informations diffusées sur le Site sont fournies par notre Société à titre strictement et exclusivement informatif et indicatif.

Notre Société fait ses meilleurs efforts pour maintenir le Site à jour et diffuser des informations fiables et licites. Cependant, malgré tout le soin et l’attention apportés à la sélection des sources et à la rédaction des contenus et informations, notre Société ne saurait pour autant garantir l’intégrité, l'exactitude, l'exhaustivité, l’actualité ou autre qualité des informations diffusées sur le Site, à l’exception des informations relatives aux prix et caractéristiques essentielles des produits et/ou services proposés à la vente par notre Société sur le Site.

L’accès au Site implique la connaissance et l’acceptation des caractéristiques et des limites d’internet, notamment en ce qui concerne les performances techniques, les temps de réponse pour consulter, interroger ou transférer des informations, les risques d’interruption, et plus généralement, les risques inhérents à toute connexion et transmission sur internet, l’absence de protection de certaines données contre des détournements éventuels et les risques de contamination par d’éventuels virus circulant sur le réseau. Il Vous appartient en conséquence de prendre toutes les mesures appropriées de façon à protéger vos propres matériels, données et/ou logiciels stockés sur votre équipement informatique, ainsi que les informations que vous communiquez à notre Société sur le Site, contre toute atteinte et d’en assurer des sauvegardes régulières.

Notre Société assure la maintenance évolutive du Site. Il n’existe aucun droit au maintien de versions antérieures du Site ou à une quelconque maintenance curative.

Vous êtes seul maître de la bonne utilisation du Site. Aucun conseil et aucune information, qu'ils soient oraux ou écrits, obtenus lors de votre utilisation du Site ne sont susceptibles de créer de garanties non expressément prévues par les CGU, les CGV et/ou la loi applicable.

Notre relation 🤝
Notre responsabilité
La responsabilité de notre Société ne saurait être engagée, d’une façon générale, dans tous les cas où l'inexécution ou la mauvaise exécution de ses prestations et/ou obligations résulterait d'un cas de force majeure au sens de l’article 1218 du Code civil ou cas fortuit indépendant de sa volonté ou d’une faute de votre part dans la mesure de la loi et de la jurisprudence applicable.

Le Site peut contenir des liens hypertextes vers des sites internet tiers qui ne sont pas régis par les CGU.  Notre Société ne dispose d'aucun contrôle quant aux contenus des sites internet tiers référencés par des liens hypertextes. Ces sites internet sont édités par des sociétés tierces indépendantes d'QCMED. QCMED ne saurait en conséquence assumer une quelconque responsabilité quant aux contenus, publicités, produits, services ou toute autre information ou donnée, disponibles sur ou à partir de ces sites. En conséquence, vous reconnaissez être seul responsable de l’accès et de l’utilisation de ces sites. Notre Société ne pourra être tenue responsable de tous dommages ou pertes avérés ou allégués consécutifs ou en relation avec l'utilisation ou le fait d'avoir fait confiance aux contenus, à des biens ou des services disponibles sur ces sites.

Notre Société ne saurait être tenue responsable de l’altération, de la perte, de la destruction ou de la transmission de données, ou de tout dommage affectant le matériel ou le système informatique de l’Utilisateur ou d’un tiers et qui résulterait de la navigation sur ou de l’utilisation du Site, ou de l’envoi de virus via les contenus du site provenant de tiers.

Votre responsabilité
Chaque Utilisateur s'engage à utiliser le Site de bonne foi et à ne pas faire un usage du Site qui serait contraire aux lois ou aux règlements sous peine d'engager sa responsabilité.

Tout Utilisateur s'interdit tout usage du Site qui serait susceptible de porter atteinte aux droits d’QCMED ou qui serait susceptible de causer un dommage à QCMED et à ses partenaires. Tout Utilisateur s'interdit tout usage du Site qui serait de nature à porter atteinte à l'intégrité de l'infrastructure technique d’QCMED, notamment ses serveurs informatiques. 

L’Utilisateur est seul responsable des informations qu’il renseigne ou communique via le Site et s’engage à les mettre à jour lorsque c’est nécessaire.

L’utilisateur s’engage par ailleurs à ne faire qu’un usage strictement privé du Site et des Services mis à sa disposition.

Comment nous utilisons et protégeons vos données personnelles 🗄
L’utilisation du Site est susceptible de donner lieu à la collecte et au traitement de données à caractère personnel Vous concernant. La collecte et le traitement de vos données à caractère personnel, ainsi que les droits dont Vous disposez, sont explicités au sein de notre Politique de Confidentialité https://www.QCMED.com/a-propos/charte-de-confidentialite.

Notre propriété intellectuelle ⚖️
Le Site et/ou tous les éléments se trouvant sur le Site (notamment textes, images, logos, photographies, etc.) et/ou les dénominations et logos QCMED et/ou les produits et Services QCMED, sont protégés par les droits de propriété intellectuelle (y compris notamment tous droits d’auteur, droits sur les brevets, les marques, les dessins et modèles, les bases de données, les noms de domaine et tout autre droit de propriété intellectuelle existant ou futur, français et internationaux) et appartiennent à notre Société ou à des tiers nous ayant autorisé à les exploiter.

L’utilisation du Site ne Vous confère aucun droit – et notamment aucun droit de propriété intellectuelle – sur le Site et/ou les éléments se trouvant sur le Site à l’exception d’un droit personnel d’utilisation, gratuit, non transférable et non exclusif, limité exclusivement à la consultation du Site et des éléments se trouvant sur le Site.

Il est strictement interdit de représenter, de reproduire et/ou d’exploiter notamment à des fins commerciales le Site ou un ou plusieurs de ses éléments, totalement ou partiellement, sous quelque forme et par quelque moyen que ce soit y compris par des techniques de “web scraping”, sans l’accord écrit et préalable d’QCMED. 

Vous vous engagez à ne pas copier, modifier, assembler, décompiler, altérer, vendre, louer, prêter, diffuser, distribuer ou transférer le Site et/ou un ou plusieurs de ses éléments, créer des œuvres dérivées à partir de ces œuvres, autoriser un tiers à commettre de tels actes ou lui permettre de le faire, sans l’accord écrit et préalable d’QCMED. 

Toute reproduction ou représentation totale ou partielle du Site ou de tout ou partie des éléments se trouvant sur le Site sans l’accord préalable écrit de notre Société constitue une violation des droits de propriété intellectuelle de notre Société et/ou des tiers concédant et est susceptible d’entraîner des poursuites civiles et pénales.

Durée de ces CGU ⏰
Et leur fin…

Les CGU entrent en vigueur à compter de leur acceptation par les Utilisateurs et prennent fin lors de la clôture de Votre dernier Compte en activité. À cet égard, tout Utilisateur peut demander la désactivation temporaire ou la fermeture définitive de son Compte à tout moment en envoyant un courriel à hello@QCMED.com pour la partie Education et à assurance@QCMED.com pour la partie Assurance.

En sus de ce qui précède, QCMED se réserve expressément la possibilité de suspendre et/ou résilier un Compte, de plein droit et sans autre formalité, dans les cas suivants :

en cas de manquement d'un Utilisateur à l'une quelconque des obligations prévues aux CGU. QCMED informera l'Utilisateur de ladite suspension et/ou résiliation ainsi que de ses motifs. Une mesure de suspension peut être suivie immédiatement ou non d'une mesure de résiliation si QCMED le juge utile à la conservation de ses intérêts ainsi qu'à ceux des tiers, notamment en cas d'atteinte grave aux CGU. Des mesures de suppression d'accès à tout ou partie du Site peuvent également être mises en œuvre en parallèle par QCMED ;
en cas d'inactivité du Compte d'un Utilisateur sur une période de 24 (vingt-quatre) mois consécutifs. Ce délai est calculé à compter de la date de dernière connexion de l'Utilisateur à son Compte. L'Utilisateur sera informé par courrier électronique de la désactivation prochaine de son Compte au cours du mois précédant la désactivation.
À la fin des CGU, les données fournies par l'Utilisateur seront supprimées, à l'exception de celles dont la loi impose la conservation.

Eléments légaux 👩🏽‍⚖️
Droit applicable, non renonciation et indépendance des clauses

Les CGU seront exécutées et interprétées conformément au droit français. En cas de litige, l’Utilisateur s'adressera préalablement à QCMED pour obtenir une solution amiable.

Le fait pour l’une ou l’autre des parties de ne pas se prévaloir d’un manquement de l’autre partie à l’une quelconque de ses obligations au titre des CGU ne saurait être interprété comme une renonciation à l’obligation en cause.

Si une partie quelconque des présentes CGU devait s'avérer nulle, invalide ou inapplicable pour quelque raison que ce soit, le terme ou les termes en question seraient déclarés inexistants et les termes restants garderaient toute leur force et leur portée et continueraient à être applicables. Les termes déclarés inexistants seraient alors remplacés par les termes qui se rapprocheront le plus du contenu et du sens de la rédaction première.

Comment nous contacter? 📬
Pour tout renseignement, vous pouvez contacter QCMED par voie postale à l’adresse suivante : QCMED, 170 boulevard de la Villette à Paris (75019), ou par email à à l’adresse hello@QCMED.com pour la partie Education et à l’adresse assurance@QCMED.com pour la partie Assurance.

Conformément aux articles L.616-1 et R.616-1 du code de la consommation, QCMED a mis en place un dispositif de médiation de la consommation. L'entité de médiation retenue est : SAS CNPM - MÉDIATION - CONSOMMATION. En cas de litige, le consommateur pourra déposer sa réclamation sur le site http://cnpm-mediation-consommation.eu ou par voie postale en écrivant à “CNPM MÉDIATION-CONSOMMATION - 27, avenue de la Libération – 42400 SAINT-CHAMOND”.
                </div>
            </div>
            <Footer style={userInfo.email !== '' ? 'header' : ''} />
        </>
    )
}
