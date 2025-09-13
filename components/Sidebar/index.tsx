import styles from "@/styles/sidebar.module.scss"
import AuthDataType from "@/types/authDataType"
import getAuth from "@/utils/getAuth"
import { useRouter } from "next/router"
import { JSX, useEffect, useState } from "react"
import { FaCalendar, FaCalendarAlt, FaRegUserCircle, FaUsers } from "react-icons/fa"
import { FaListCheck } from "react-icons/fa6"
import { IoMdPeople, IoMdSettings } from "react-icons/io"
import { LuFilePenLine } from "react-icons/lu"
import { MdAssignment, MdExitToApp, MdQuiz } from "react-icons/md"
import { RiPagesLine } from "react-icons/ri"
import PopupMissLogin from "../MissLogin"

interface props {
    setInfo?: React.Dispatch<React.SetStateAction<string[]>>
    userInfo?: string[]
    authData: AuthDataType | null | undefined
    traceID?: string

}

type NavItemsType = {
    icon: JSX.Element
    name: string
    path?: string
    label?: string
    renderFn?: () => JSX.Element
}

export default function Sidebar(props: props) {
    const router = useRouter()
    const [authData,] = useState<AuthDataType | null | undefined>(props.authData)
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)
    const [isMissingLoginShown, setIsMissingLoginShown] = useState<boolean>(false)

    const baseNavItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/correcaoRedacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
    ]

    const navItems = authData?.role === "admin"
        ? [...baseNavItems, { icon: <FaListCheck />, name: "Aprovar Cursinhos", path: "/admin/aprovar_cursinho" }, { icon: <FaUsers />, name: "Usuários", path: "/admin/usuarios" }]
        : baseNavItems;

    const activeIndex = navItems.findIndex(item => item.path === router.pathname);

    async function handleSignout() {
        if (await getAuth()) {
            router.push("/")
        }
    }

    useEffect(() => {
        if (props.authData !== undefined && props.authData !== null) {
            return props.setInfo?.([props.authData.nome, props.authData.foto, props.authData.username, props.authData.role])
        }
        setIsMissingLoginShown(true)

    }, [props.authData])



    return (

        <>
            {isMissingLoginShown && <PopupMissLogin redirectTo="/" traceID={props.traceID} />}
            {/* {<TracePopup message="Erro ao carregar a página, se esse problema persistir, contate o suporte." traceId={props.traceID ?? ""}></TracePopup>} */}
            <section className={styles.page}>
                <aside className={styles.sidebar}>
                    <div className={styles.inner}>
                        <div className={styles.header}>
                            <img className={styles.logo} src="/assets/img/logo.png" alt="Logo" />
                            <h1>VemFacul</h1>
                        </div>

                        <nav
                            className={styles.menu}
                            style={{ '--top': `${activeIndex >= 0 ? activeIndex * 56 : 0}px` } as React.CSSProperties}
                        >
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => item.path ? router.push(item.path) : null}
                                    type="button"
                                    className={router.pathname === item.path ? 'active' : ''}
                                >
                                    <span>{item.icon}</span>
                                    <p className={styles.text}>{item.name}</p>
                                </button>
                            ))}
                            <div style={{ marginTop: "auto" }}>
                                {!isMissingLoginShown && <button onClick={() => setProfileOptionsVisible(true)} type="button">
                                    <img className={styles.imageProfile} style={{ borderRadius: "50%", height: "40px", width: "40px", objectFit: "cover" }} src={authData?.foto} alt="Logo" />
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                                        <p className={styles.text}>{authData?.nome}</p>
                                        <p className={styles.textUser}>@{authData?.username}</p>
                                    </div>

                                </button>}
                                {profileOptionsVisible && (
                                    <div className={styles.overlay} onClick={() => setProfileOptionsVisible(false)}>
                                        <div className={styles.popupProfileOptions} onClick={(e) => e.stopPropagation()} >
                                            <div className={styles.almostMainDiv}>
                                                <div className={styles.miniProfileDiv}>
                                                    <div className={styles.options}>
                                                        <div onClick={() => router.push('/calendario')}>
                                                            <p><IoMdSettings />Configurações</p>
                                                        </div>
                                                        <div onClick={handleSignout}>
                                                            <p><MdExitToApp color="black" />Sair de {authData?.nome}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </aside>
            </section>

        </>

    )
}
