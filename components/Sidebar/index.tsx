import Api from "@/api"
import styles from "@/styles/sidebar.module.scss"
import AuthDataType from "@/types/authDataType"
import getAuth from "@/utils/getAuth"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaCalendar, FaCalendarAlt, FaRegUserCircle } from "react-icons/fa"
import { IoMdPeople, IoMdSettings } from "react-icons/io"
import { LuFilePenLine } from "react-icons/lu"
import { MdAssignment, MdExitToApp, MdQuiz } from "react-icons/md"
import { RiPagesLine } from "react-icons/ri"

interface props {
    setInfo?: React.Dispatch<React.SetStateAction<string[]>>
    userInfo?: string[]
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar(props: props) {
    const router = useRouter()
    const [authData, setAuthData] = useState<AuthDataType>()
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)

    const navItems = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/correcaoRedacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
    ]

    const activeIndex = navItems.findIndex(item => item.path === router.pathname) == -2 ? 7 : navItems.findIndex(item => item.path === router.pathname)

    function handleSignout() {
        if (getAuth()) {
            localStorage.removeItem('auth');
            if (router.pathname === '/') {
                router.reload();
            } else {
                router.push('/');
            }
        }
    }

    useEffect(() => {
        (async () => {
            if (getAuth()) {
                props.setIsLoading(true)
                try {
                    const response = await Api.getProfileInfo()
                    if (response.data.code === "PROFILE_INFO") {

                        props.setIsLoading(false)
                        props.setInfo?.([response.data.data.nome, response.data.data.foto, response.data.data.username])
                        return setAuthData({
                            name: response.data.data.nome,
                            image: response.data.data.foto,
                            username: response.data.data.username,
                        })
                    }
                } catch (error) {
                    if (error instanceof AxiosError) {
                        if (error.response?.data.code === "INVALID_TOKEN") {
                            localStorage.removeItem('auth');
                            router.push('/')
                            props.setIsLoading(false)

                        }
                    }
                }
            }

            router.push('/')
        })()
    }, [])

    return (
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
                                onClick={() => router.push(item.path)}
                                type="button"
                                className={router.pathname === item.path ? 'active' : ''}
                            >
                                <span>{item.icon}</span>
                                <p className={styles.text}>{item.name}</p>
                            </button>
                        ))}
                        <div style={{ marginTop: "auto" }}>
                            <button onClick={() => setProfileOptionsVisible(true)} type="button">
                                <img className={styles.imageProfile} style={{ borderRadius: "50%", height: "40px", width: "40px", objectFit: "cover" }} src={authData?.image} alt="Logo" />
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                                    <p className={styles.text}>{authData?.name}</p>
                                    <p className={styles.textUser}>@{authData?.username}</p>
                                </div>

                            </button>
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
                                                        <p><MdExitToApp color="black" />Sair de {authData?.name}</p>
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
    )
}
