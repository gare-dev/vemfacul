import Api from "@/api";
import useAlert from "@/hooks/useAlert";
import useCalendarData from "@/hooks/useCalendarData";
import s from "@/styles/popup.module.scss"
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import LoadingBar from "../LoadingBar";
import { FaRegSave } from "react-icons/fa";

interface props {
    isVisible: boolean
    setIsVisible: () => void
    canAdd: boolean
    canRemove: boolean
    canEdit: boolean
    removeFunction?: () => void
    editFunction?: () => void
}

export default function Popup(props: props) {
    const { calendarData, setCalendarData } = useCalendarData()
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert()
    const [editMode, setEditMode] = useState(false)

    const [editedTitle, setEditedTitle] = useState(calendarData.title);
    const [editedDesc, setEditedDesc] = useState(calendarData.descricao);

    let intervalId: NodeJS.Timeout;

    useEffect(() => {
        setEditedTitle(calendarData.title);
        setEditedDesc(calendarData.descricao);
    }, [calendarData])

    const startLoading = () => {
        setLoading(true);
        setProgress(10);

        intervalId = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }, 200);
    };

    const stopLoading = () => {
        clearInterval(intervalId);
        setProgress(100);
        setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 400);
    };

    function padZero(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    async function saveEvent() {
        try {
            startLoading()
            const response = await Api.insertPersonalEvent(
                calendarData.day,
                calendarData.month,
                calendarData.year,
                calendarData.title,
                calendarData.cursinho,
                calendarData.descricao,
                calendarData.foto,
                calendarData.link,
                calendarData.type,
                calendarData.color,
                calendarData.main_title
            )
            if (response.status === 201) {
                showAlert('Evento adicionado à sua agenda pessoal!', 'success')
            }
        } catch (error) {
            console.log("Evento não foi salvo." + error)
        } finally {
            stopLoading()
        }
    }

    async function saveEditedEvent() {
        if (editedTitle.trim() === "") {
            showAlert("O título não pode ser vazio.", "warning");
            return;
        }
        try {
            startLoading()
            // aqui você pode usar a rota certa de edição (simulei como updatePersonalEvent)
            // const response = await Api.updatePersonalEvent({
            //     ...calendarData,
            //     title: editedTitle,
            //     descricao: editedDesc
            // })

            // if (response.status === 200) {
            //     showAlert("Evento atualizado com sucesso!", "success")
            //     setEditMode(false)
            // }
            setCalendarData({
                ...calendarData,
                title: editedTitle,
                descricao: editedDesc
            })
        } catch (err) {
            console.error(err)
            showAlert("Erro ao atualizar evento", "warning")
        } finally {
            stopLoading()
            setEditMode(false)

        }
    }

    return (
        props.isVisible &&
        (<div className={s.mainDiv}>
            {loading && <LoadingBar progress={progress} />}
            <div className={s.popupBox}>
                <div className={s.divBox}>
                    <div className={s.dateAndImageDiv}>
                        {calendarData.foto ? (
                            <div className={s.imageDiv}>
                                <img className={s.image} src={calendarData.foto} alt="" />
                            </div>
                        ) : (
                            <div style={{ backgroundColor: calendarData.color, borderColor: calendarData.color }} className={s.noImageDiv}>
                                <p className={s.noImageText}>{calendarData.main_title}</p>
                            </div>
                        )}
                        <p>{`${padZero(calendarData.day)}/${String(Number(calendarData.month) + 1).padStart(2, "0")}/${calendarData.year}`}</p>
                        {!editMode ? <p>{`${calendarData.hora ?? ""} `}</p> : <input type="time" className={s.inputTimeEdit} value={calendarData.hora ?? ""} onChange={(e) => setCalendarData({ ...calendarData, hora: e.target.value })} />}
                    </div>

                    <div className={s.titleAndDescDiv}>
                        <div className={s.titleDiv}>
                            {calendarData.cursinho &&
                                <a style={{ color: calendarData.color }} className={s.title}>
                                    {`${calendarData.cursinho ? `${calendarData.cursinho}:` : ""}`}
                                </a>
                            }

                            {editMode ? (
                                <input
                                    style={{ color: calendarData.color }}
                                    className={s.inputEdit}
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                            ) : (
                                calendarData.link ? (
                                    <a
                                        href={calendarData.link}
                                        style={{ textDecoration: calendarData.cursinho ? "underline" : "" }}
                                        className={s.type}
                                    >
                                        {calendarData.title}
                                    </a>
                                ) : (
                                    <span style={{ color: calendarData.color }} className={s.type}>
                                        {calendarData.title}
                                    </span>
                                )
                            )}
                        </div>

                        <div className={s.descDiv}>
                            {editMode ? (
                                <textarea
                                    className={s.textareaEdit}
                                    value={editedDesc}
                                    onChange={(e) => setEditedDesc(e.target.value)}
                                />
                            ) : (
                                <p>{calendarData.descricao}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={s.closeDiv}>
                    <p onClick={() => props.setIsVisible()} className={s.closeText}>X</p>
                </div>

                <div className={s.bttsDiv}>
                    {props.canAdd &&
                        (<div onClick={() => saveEvent()} className={s.addDiv}>
                            <p><IoMdAdd /></p>
                        </div>)
                    }

                    {props.canRemove &&
                        (<div onClick={props.removeFunction} className={s.removeDiv}>
                            <p><MdDeleteOutline /></p>
                        </div>)
                    }

                    {props.canEdit && !editMode &&
                        (<div onClick={() => setEditMode(true)} className={s.editDiv}>
                            <p><MdModeEdit /></p>
                        </div>)
                    }

                    {editMode &&
                        (<div onClick={saveEditedEvent} className={s.saveDiv}>
                            <p><FaRegSave size={'0.8em'} />
                            </p>
                        </div>)
                    }
                </div>
            </div>
        </div>)
    );
}
