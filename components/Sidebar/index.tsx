import styles from "@/styles/sidebar.module.scss"
import AuthDataType from "@/types/authDataType"
import getAuth from "@/utils/getAuth"
import { useRouter } from "next/router"
import { JSX, useEffect, useState } from "react"
import { FaBars, FaCalendar, FaCalendarAlt, FaRegUserCircle, FaUsers } from "react-icons/fa"
import { FaListCheck } from "react-icons/fa6"
import { IoMdPeople, IoMdSettings } from "react-icons/io"
import { LuFilePenLine } from "react-icons/lu"
import { MdAssignment, MdExitToApp, MdOutlineListAlt, MdQuiz } from "react-icons/md"
import { RiPagesLine } from "react-icons/ri"
import PopupMissLogin from "../MissLogin"
import Image from "next/image"

interface props {
    setInfo?: React.Dispatch<React.SetStateAction<string[]>>
    userInfo?: string[]
    authData: AuthDataType | null | undefined
    traceID?: string | null
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
    const isMobile = useIsMobile();

    const [authData,] = useState<AuthDataType | null | undefined>(props.authData)
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)
    const [isMissingLoginShown, setIsMissingLoginShown] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const [innerHeight, setInnerHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

    const sidebarWidth = isMobile ? (isSidebarOpen ? "260px" : "0px") : undefined;
    const headerOpacity = isMobile ? (isSidebarOpen ? 1 : 0) : undefined;


    const [, setShowHeader] = useState(true);
    let lastScrollY = 0;

    function useIsMobile() {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            function handleResize() {
                setIsMobile(window.innerWidth < 1024);
            }

            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return isMobile;
    }

    const userItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/correcaoRedacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
    ]

    const adminItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/correcaoRedacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
        { icon: <FaListCheck />, name: "Aprovar Cursinhos", path: "/admin/aprovar_cursinho" },
        { icon: <FaUsers />, name: "Usuários", path: "/admin/usuarios" },
        { icon: <MdOutlineListAlt />, name: "Log da API", path: "/admin/api_log" }
    ]

    const cursinhoItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
        { icon: <FaListCheck />, name: "Criar Evento", path: "/cursinho/eventos" },

    ]

    const role = authData?.role

    const navItems = role === "admin" ? adminItems : role === "dono de cursinho" ? cursinhoItems : userItems

    const activeIndex = navItems.findIndex(item => item.path === router.pathname);

    async function handleSignout() {
        if (await getAuth()) {
            router.push("/")
        }
        router.push("/")
    }

    useEffect(() => {
        if (props.authData !== undefined && props.authData !== null) {
            return props.setInfo?.([props.authData.nome, props.authData.foto, props.authData.username, props.authData.role])
        }
        setIsMissingLoginShown(true)

    }, [props.authData])

    useEffect(() => {
        if (isMobile) {
            if (isSidebarOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isSidebarOpen, isMobile]);

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }

            lastScrollY = currentScrollY;
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        function handleResize() {
            setInnerHeight(window.innerHeight);
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (

        <>

            {isMobile && (
                <div
                    // style={{
                    //     position: "fixed",
                    //     top: 0,
                    //     width: "100%",
                    //     transform: showHeader ? "translateY(0)" : "translateY(-100%)",
                    //     transition: "transform 0.3s ease",
                    // }} 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.mobileHeader}>

                    {/* <div className={styles.headerMobile}> */}
                    {/* 
                        <img
                            src={props.authData?.foto}
                            alt="Logo"
                            className={styles.mobileLogo}
                        /> */}
                    {/* <p>Feed</p> */}
                    {!isSidebarOpen && <FaBars size={"1.5em"} color="#001ECB" />}

                    {/* </div> */}

                </div>
            )}
            {isMissingLoginShown && <PopupMissLogin redirectTo="/" traceID={props.traceID} />}
            {/* {<TracePopup message="Erro ao carregar a página, se esse problema persistir, contate o suporte." traceId={props.traceID ?? ""}></TracePopup>} */}


            <section className={styles.page}>
                {isMobile && isSidebarOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.3)",
                            zIndex: 9999,
                        }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <aside style={{ width: sidebarWidth }} className={styles.sidebar}>
                    <div className={styles.inner}>
                        <div style={{ width: sidebarWidth }} className={styles.header}>
                            <Image height={80} width={80} className={styles.logo} src="/assets/img/logo.png" alt="Logo" />
                            <h1 style={{ opacity: headerOpacity }}>VemFacul</h1>
                        </div>

                        <nav
                            style={{ '--top': `${activeIndex >= 0 ? activeIndex * (innerHeight < 751 ? 45 : 56) : (innerHeight < 751 ? 315 : 392)}px`, '--after-height': `${innerHeight < 751 ? 45 : 56}px` } as React.CSSProperties}
                            className={styles.menu}

                        >
                            {navItems.map((item, index) => (
                                <button
                                    style={isMobile ? { width: sidebarWidth, height: innerHeight < 751 ? "45px" : "56px" } : undefined}
                                    key={index}
                                    onClick={() => item.path ? router.push(item.path) : null}
                                    type="button"
                                    className={`${router.pathname === item.path ? 'active' : ''} ${styles.menuItem}`}
                                >
                                    <span>{item.icon}</span>
                                    <p style={isMobile ? { opacity: headerOpacity } : undefined} className={styles.text}>{item.name}</p>
                                </button>
                            ))}
                            <div style={{ marginTop: "auto" }}>
                                {!isMissingLoginShown && <button style={isMobile ? { width: sidebarWidth } : undefined} onClick={() => setProfileOptionsVisible(true)} type="button">
                                    <Image width={40} height={40} style={{ borderRadius: "50%", height: "40px", width: "40px", objectFit: "cover" }} src={authData?.foto ?? ""} alt="Logo" />
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                                        <p style={isMobile ? { opacity: headerOpacity } : undefined} className={styles.text}>{authData?.nome}</p>
                                        <p style={isMobile ? { opacity: headerOpacity } : undefined} className={styles.textUser}>@{authData?.username}</p>
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
