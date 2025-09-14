import Api from "@/api";
import Popup from "@/components/Popup";
import PopupFilter from "@/components/PopupFilter";
import Sidebar from "@/components/Sidebar";
import DemoWrapper from "@/hooks/DemoWrapper";
import AuthDataType from "@/types/authDataType";
import PopupType from "@/types/data";
import { FiltrosType } from "@/types/filtrosType";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";


type Props = {
    eventsProp: PopupType[]
    authData?: AuthDataType | null | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    try {
        const cookie = context.req.headers.cookie
        Api.setCookie(cookie || "")

        const [response, authData] = await Promise.all([
            Api.getEvents(),
            Api.getProfileInfo()
        ])

        const eventos = response.status === 200 ? response.data.data.map((evento: PopupType) => ({
            ...evento,
            created_at: new Date(evento.created_at!).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        })) : []


        return {
            props: {
                eventsProp: eventos,
                authData: authData.data.code === "PROFILE_INFO" ? authData.data.data : null
            }
        }

    } catch (error) {
        console.error("Error fetching user profile or postagens:", error);
        if (error instanceof AxiosError) {
            if (error.response?.data.code === "NO_FOUND_EVENTS") {
                console.error("Erro ao buscar eventos:", error.response.data.message);
                return {
                    props: {
                        eventsProp: [],
                        authData: null
                    }
                }
            }
            if (error.code === "ERR_NETWORK") {
                return {
                    props: {
                        eventsProp: [],
                        authData: null
                    }
                }
            }
        }
        return {
            props: {
                eventsProp: []
            }
        }
    }
}

export default function Eventos({ eventsProp, authData }: Props) {
    const [events, setEvents] = useState<PopupType[]>(eventsProp || [])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [originalEvents,] = useState<PopupType[]>(eventsProp || [])
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [popupVisible, setPopupVisible] = useState<boolean>(false)
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }]);

    // const getEvents = async () => {
    //     try {
    //         setIsLoading(true)
    //         const response = await Api.getEvents()

    //         if (response.status === 200) {
    //             setEvents(response.data.data)
    //             setOriginalEvents(response.data.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         if (error instanceof AxiosError) {
    //             if (error.response?.data.code === "NO_FOUND_EVENTS") {
    //                 console.error("Erro ao buscar eventos:", error.response.data.message);
    //             }
    //             if (error.code === "ERR_NETWORK") {
    //                 showAlert("Não foi possível obter os eventos. Tente novamente mais tarde.", "danger");
    //             }
    //         }
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     getEvents()
    // }, [])

    function getFilter() {
        if (
            filtroEventos[0].tipoDeEvento.length === 0 &&
            filtroEventos[0].tipodeCursinho.length === 0
        ) {
            setPopupVisible(false);
            return setEvents(originalEvents);
        }

        const retorno = originalEvents.filter((dado) => {
            return filtroEventos.some((f) => {
                const tipoOk = f.tipoDeEvento.length === 0 || f.tipoDeEvento.includes(dado.type);
                const cursinhoOk = f.tipodeCursinho.length === 0 || f.tipodeCursinho.includes(dado.cursinho?.toLowerCase());
                return tipoOk && cursinhoOk;
            });
        });

        setPopupVisible(false);
        setEvents(retorno);
    }

    return (

        <>
            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()}
            />
            <Popup
                canAdd
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canRemove={false}
                canEdit={false}
            />
            <Sidebar isLoading={isLoading} setIsLoading={setIsLoading} authData={authData} />

            <div>
                <DemoWrapper
                    isEditable={false}
                    eventos={events}
                    popUpClick={() => setIsVisible(true)}
                    popupFilterClick={() => setPopupVisible(true)} />
            </div>
        </>
    )
}