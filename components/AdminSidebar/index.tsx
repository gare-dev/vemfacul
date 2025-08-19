import Api from "@/api"
import styles from "@/styles/adminsidebar.module.scss"
import getAdminToken from "@/utils/getAdminToken"
import { useRouter } from "next/router"
import React, { JSX, useEffect, useState } from "react"
import type { AdminAuthType } from "@/types/authDataType";
import { MdExitToApp } from "react-icons/md"
import { IoPerson } from "react-icons/io5"
import { AxiosError } from "axios"

export type navItemsType = {
    icon: React.ReactNode;
    label: string;
    name: string;
    renderFn: () => JSX.Element;
}

interface props {
    navItems: navItemsType[];
    activeItem: string;
    setRender: (render: JSX.Element) => void;
    setActiveItem: (name: string) => void;
}

const AdminSidebar: React.FC<props> = ({ navItems, activeItem, setRender, setActiveItem }) => {
    const router = useRouter()
    const [authData, setAuthData] = useState<AdminAuthType>()
    const [profileOptionsVisible, setProfileOptionsVisible] = useState<boolean>(false)

    const activeIndex = navItems.findIndex(item => item.name === activeItem)

    function handleSignout() {
        if (getAdminToken()) {
            localStorage.removeItem('admin_token');
            router.push('/')
        }
    }

    useEffect(() => {
        const handleGetProfileIfo = async () => {
            if (getAdminToken()) {
                try {
                    const response = await Api.adminAuth()
                    if (response.data.code === "ADMIN_AUTHENTICATED") {
                        return setAuthData({
                            id: response.data.data.id,
                            login: response.data.data.username,
                        })
                    }
                } catch (error) {
                    if (error instanceof AxiosError) {
                        if (error.response?.data.code === "INVALID_TOKEN") {
                            return router.push('/config/login')
                        }
                    }
                }
            }
            router.push('/config/login')
        }
        handleGetProfileIfo()
    }, [])

    return (
        <section className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.inner}>
                    <div className={styles.header}>
                        <img className={styles.logo} src="/assets/img/logo.png" alt="Logo" />
                        <h1>VemFacul Admin</h1>
                    </div>

                    <nav
                        className={styles.menu}
                        style={{ '--top': `${activeIndex >= 0 ? activeIndex * 56 : 0}px` } as React.CSSProperties}
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setRender(item.renderFn());
                                    setActiveItem(item.name);
                                }}
                                type="button"
                                className={activeItem === item.name ? 'active' : ''}
                            >
                                <span>{item.icon}</span>
                                <p className={styles.text}>{item.label}</p>
                            </button>
                        ))}

                        <div style={{ marginTop: "auto" }}>
                            <button onClick={() => setProfileOptionsVisible(true)} type="button">
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                                    <p className={styles.text}><IoPerson size={'1.5em'} />{authData?.login}</p>
                                </div>
                            </button>

                            {profileOptionsVisible && (
                                <div className={styles.overlay} onClick={() => setProfileOptionsVisible(false)}>
                                    <div className={styles.popupProfileOptions} onClick={(e) => e.stopPropagation()} >
                                        <div className={styles.almostMainDiv}>
                                            <div className={styles.miniProfileDiv}>
                                                <div className={styles.options}>
                                                    <div onClick={handleSignout}>
                                                        <p><MdExitToApp color="black" />Sair de {authData?.login}</p>
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

export default AdminSidebar;

