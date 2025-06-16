import styles from "@/styles/landinpage.module.scss";
import Api from "@/api";
import Header from "@/components/Header";
import Card from "@/components/Cards";
import Funcionalidades from "@/components/Funcionalidades";
import Popup from "@/components/Popup";
import PopupFilter from "@/components/PopupFilter";
import DemoWrapper from "@/hooks/DemoWrapper";
import useCalendarData from "@/hooks/useCalendarData";
import PopupType from "@/types/data";
import { FiltrosType } from "@/types/filtrosType";
import { useEffect, useState } from "react";




export default function LandingPage() {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { calendarData } = useCalendarData()
    const [hasOpened, setHasOpened] = useState<boolean>(false)
    const [events, setEvents] = useState<PopupType[]>([])
    const [originalEvents, setOriginalEvents] = useState<PopupType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (!hasOpened) return setHasOpened(true)
        setIsVisible(true)
    }, [calendarData])

    useEffect(() => {
        getEvents()
    }, [])


    useEffect(() => {
        console.log("filtroEventos", filtroEventos)
    }, [filtroEventos])


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


    if (isLoading) {
        return (
            <div style={{
                position: "fixed",
                height: "100%",
                width: "100%"
            }}>
            </div>
        )
    }
    const cardCursos = [
        {
            title: "Preparação Completa",
            img: "/assets/img/etapa.png",
            position: "left",
            top: "5%",
        },
        {
            title: "Inclusão e Oportunidade",
            img: "/assets/img/anglo.png",
            text: "Acreditamos que todos merecem acesso ao ensino superior. Oferecemos apoio pedagógico, aulas dinâmicas e um ambiente acolhedor para transformar sonhos em conquistas.",
            position: "right",
            top: "38%"
        },
        {
            title: "Tradição em Resultados",
            img: "/assets/img/epufabc.png",
            text: "Com estrutura completa, simulados frequentes e acompanhamento individualizado, potencializamos o desempenho dos estudantes rumo às melhores universidades do país.",
            position: "left",
            bottom: "0"
        }
    ]
    return (

        <div className="pb-24" style={{ backgroundColor: "#D0D7FF" }}>
            <Popup
                canAdd
                isVisible={isVisible}
                setIsVisible={() => setIsVisible(false)}
                canRemove={false}
                canEdit={false}
            />

            <PopupFilter
                setFiltroEventos={setFiltroEventos}
                filtroEventos={filtroEventos}
                isVisible={popupVisible}
                callFilter={() => getFilter()}
            />

            <Header />
            <Card title
                img="/assets/img/cardMain_img.png" />
            <h1 className={styles.tituloCards} style={{
                width: "80%",
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "left",
                position: "relative",
                left: '14.2rem',
                margin: ".2rem 0 0 0",
                color: "#333"
            }}>Principais cursos</h1>


            <div style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",

            }}>
                <div className="cardcursos" style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "70rem",
                    margin: " 0",
                }}>
                    {
                        cardCursos.map((item, index) => (
                            <Card
                                style={{
                                    [item.position]: "0",
                                    top: [item.top],
                                    bottom: [item.bottom]
                                }}
                                key={index}
                                curso={item.title}
                                img={item.img}
                            />
                        ))
                    }
                    <div className={styles.textInfo}>
                        <p>
                            Metodologia inovadora, materiais atualizados, professores experientes, preparação de qualidade, aprovação.
                        </p>
                    </div>
                    <div className={styles.textInfo} style={{
                        left: "0",
                        top: "41%",
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0"
                    }}>
                        <p>
                            Suporte personalizado e recursos modernos para sua melhor preparação para o vestibular.
                        </p>
                    </div>
                    <div className={styles.textInfo} style={{
                        right: "0",
                        top: "75%",
                    }}>
                        <p>
                            Excelência no ensino e apoio constante para sua aprovação. Conte com nossa equipe para conquistar sua vaga na universidade.
                        </p>
                    </div>
                </div >
            </div >
            <h1 className={styles.tituloFuncionalidades} style={{
                width: "auto",
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "right",
                position: "relative",
                right: '10%',
                margin: ".2rem 0 0 0",
                color: "#333"
            }}>Funcionalidades</h1>
            <Funcionalidades />
            <main className="flex items-center justify-center">
                <DemoWrapper
                    isEditable={false}
                    eventos={events}
                    popUpClick={() => setIsVisible(true)}
                    popupFilterClick={() => setPopupVisible(true)} />
            </main>
        </div >
    )
}