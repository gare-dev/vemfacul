import Api from "@/api";
import Popup from "@/components/Popup";
import PopupFilter from "@/components/PopupFilter";
import Sidebar from "@/components/Sidebar";
import DemoWrapper from "@/hooks/DemoWrapper";
import useAlert from "@/hooks/useAlert";
import PopupType from "@/types/data";
import { FiltrosType } from "@/types/filtrosType";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";





export default function Eventos() {
    const [events, setEvents] = useState<PopupType[]>([])
    const [, setIsLoading] = useState<boolean>(false)
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>([])
    const { showAlert } = useAlert()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [popupVisible, setPopupVisible] = useState<boolean>(false)
    const [filtroEventos, setFiltroEventos] = useState<FiltrosType[]>([{
        tipoDeEvento: [],
        tipodeCursinho: []
    }]);

    const getEvents = async () => {
        try {
            setIsLoading(true)
            const response = await Api.getEvents()

            if (response.data.code === "EVENTS_SUCCESSFULLY") {
                setEvents(response.data.data)
                setOriginalEvents(response.data.data)
            }
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError) {
                if (error.response?.data.code === "NO_FOUND_EVENTS") {
                    console.error("Erro ao buscar eventos:", error.response.data.message);
                }
                if (error.code === "ERR_NETWORK") {
                    showAlert("Não foi possível obter os eventos. Tente novamente mais tarde.", "danger");
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getEvents()
    }, [])

    function getFilter() {
        if (
            filtroEventos[0].tipoDeEvento.length === 0 &&
            filtroEventos[0].tipodeCursinho.length === 0
        ) {
            setPopupVisible(false);
            console.log("VOLTOU")
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
            <Sidebar />

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