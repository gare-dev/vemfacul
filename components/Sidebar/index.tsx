import styles from "@/styles/sidebar.module.scss"
import AuthDataType from "@/types/authDataType"
import getAuth from "@/utils/getAuth"
import { useRouter } from "next/router"
import { JSX, useEffect, useState } from "react"
import { FaBars, FaCalendar, FaCalendarAlt, FaRegUserCircle, FaSearch, FaUsers } from "react-icons/fa"
import { FaListCheck } from "react-icons/fa6"
// import { FaBell } from "react-icons/fa"
import { IoMdPeople } from "react-icons/io"
import { LuFilePenLine } from "react-icons/lu"
import { MdExitToApp, MdOutlineListAlt, MdQuiz } from "react-icons/md"
import { RiPagesLine } from "react-icons/ri"
import PopupMissLogin from "../MissLogin"
import Image from "next/image"
import SetNotifications from "../setNotifications"

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
    const MOBILE_BREAKPOINT = 1024;
    const HEIGHT_BREAKPOINT = 751;
    const ITEM_HEIGHT_LARGE = 56;
    const ITEM_HEIGHT_SMALL = 45;

    const router = useRouter()
    const isMobile = useIsMobile();
    const [authData,] = useState<AuthDataType | null | undefined>(props.authData)
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)
    const [isMissingLoginShown, setIsMissingLoginShown] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const [innerHeight, setInnerHeight] = useState<number>(800);
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            setInnerHeight(window.innerHeight);
        }
    }, []);

    const sidebarWidth = isMobile ? (isSidebarOpen ? "260px" : "0px") : undefined;
    const headerOpacity = isMobile ? (isSidebarOpen ? 1 : 0) : undefined;


    const [, setShowHeader] = useState(true);
    let lastScrollY = 0;

    function useIsMobile() {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            function handleResize() {
                setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            }

            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return isMobile;
    }

    const userItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <FaSearch />, name: "Explorar", path: "/explorar" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <SetNotifications />, name: "Notificações", path: "/Notificacoes" },
        // TODO componente inteiro importador ao inves de so o icone
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/redacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        // { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
    ]

    const adminItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <FaSearch />, name: "Explorar", path: "/explorar" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <SetNotifications />, name: "Notificações", path: "/Notificacoes" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <LuFilePenLine />, name: "Correção de Redação", path: "/redacao" },
        { icon: <MdQuiz />, name: "Exercícios", path: "/exercicios" },
        // { icon: <MdAssignment />, name: "Exercício Diário", path: "/exercicioDiario" },
        { icon: <FaCalendarAlt />, name: "Calendário Pessoal", path: "/calendario" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
        { icon: <FaListCheck />, name: "Aprovar Cursinhos", path: "/admin/aprovar_cursinho" },
        { icon: <FaUsers />, name: "Usuários", path: "/admin/usuarios" },
        { icon: <MdOutlineListAlt />, name: "Log da API", path: "/admin/api_log" }
    ]

    const cursinhoItems: NavItemsType[] = [
        { icon: <RiPagesLine />, name: "Feed", path: "/feed" },
        { icon: <FaSearch />, name: "Explorar", path: "/explorar" },
        { icon: <IoMdPeople />, name: "Comunidade", path: "/comunidade" },
        { icon: <FaCalendar />, name: "Calendário Geral", path: "/eventos" },
        { icon: <FaRegUserCircle />, name: "Perfil", path: `/${authData?.username}` },
        { icon: <FaListCheck />, name: "Criar Evento", path: "/cursinho/eventos" },
    ]

    const role = authData?.role

    const navItems = role === "admin" ? adminItems : role === "dono de cursinho" ? cursinhoItems : userItems

    const isActiveRoute = (itemPath: string | undefined) => {
        if (!itemPath) return false;

        if (itemPath === `/${authData?.username}` && router.pathname === '/[username]') {
            return true;
        }

        if (itemPath === router.pathname) {
            return true;
        }

        if (itemPath !== '/' && router.pathname.startsWith(itemPath)) {
            return true;
        }

        return false;
    }

    const activeIndex = navItems.findIndex(item => isActiveRoute(item.path));

    const handleNavigation = (path: string | undefined) => {
        if (path) {
            if (isMobile) {
                setIsSidebarOpen(false);
                setTimeout(() => router.push(path), 150);
            } else {
                router.push(path);
            }
        }
    }

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

    // Fecha o sidebar no mobile quando a rota muda
    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false)
        }
    }, [router.pathname, isMobile])

    useEffect(() => {
        if (isMobile) {
            if (isSidebarOpen) {
                document.body.style.overflow = "hidden";
                document.body.style.position = "fixed";
                document.body.style.width = "100%";
            } else {
                document.body.style.overflow = "auto";
                document.body.style.position = "static";
                document.body.style.width = "auto";
            }
        } else {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.body.style.width = "auto";
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

        // Inicializar o valor correto imediatamente
        if (typeof window !== 'undefined') {
            setInnerHeight(window.innerHeight);
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calcula altura do item baseado na altura da tela
    const getItemHeight = () => {
        if (!isClient) return ITEM_HEIGHT_LARGE; // Durante SSR, usar valor padrão
        const currentHeight = innerHeight || window.innerHeight;
        return currentHeight < HEIGHT_BREAKPOINT ? ITEM_HEIGHT_SMALL : ITEM_HEIGHT_LARGE;
    };

    const itemHeight = getItemHeight();

    // Calcula a posição do indicador visual
    let top = 0;
    let showIndicator = false;

    if (activeIndex >= 0) {
        top = activeIndex * itemHeight;
        showIndicator = true;
    } else {
        // Esconde o indicador se nenhuma rota está ativa
        top = -100; // Move para fora da área visível
        showIndicator = false;
    }

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
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 9998,
                            backdropFilter: "blur(2px)",
                        }}
                        onClick={() => setIsSidebarOpen(false)}
                        onTouchStart={() => setIsSidebarOpen(false)} // Adiciona suporte para toque
                    />
                )}
                <aside style={{ width: sidebarWidth }} className={`${styles.sidebar} ${isMobile && isSidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.inner}>
                        <div style={{ width: sidebarWidth }} className={styles.header}>
                            <Image height={80} width={80} className={styles.logo} src="/assets/img/logo.png" alt="Logo" />
                            <h1 style={{ opacity: headerOpacity }}>VemFacul</h1>
                        </div>

                        <nav
                            style={{
                                '--top': `${top}px`,
                                '--after-height': `${itemHeight}px`,
                                '--indicator-opacity': showIndicator ? '1' : '0',
                            } as React.CSSProperties}
                            className={styles.menu}

                        >
                            {navItems.map((item, index) => (
                                <button
                                    style={isMobile ? { width: sidebarWidth, height: `${itemHeight}px` } : undefined}
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    type="button"
                                    className={`${isActiveRoute(item.path) ? 'active' : ''} ${styles.menuItem}`}
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
                                                        {/* <div onClick={() => router.push('/calendario')}>
                                                            <p><IoMdSettings />Configurações</p>
                                                        </div> */}
                                                        <div onClick={handleSignout}>
                                                            <p style={{ fontSize: "1em" }}><MdExitToApp color="black" />Sair de {authData?.username}</p>
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
