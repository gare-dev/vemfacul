import Api from "@/api";
import useAlert from "@/hooks/useAlert";
import usePersonalEvents from "@/hooks/usePersonalEvents";
import styles from "@/styles/popuuppersonalevents.module.scss"
import padZero from "@/utils/padZero";
import { useRouter } from "next/router";



type FormModalProps = {
    onClose: () => void;
    isVisible?: boolean;
};

export default function FormModal({ onClose, isVisible }: FormModalProps) {
    const { setPersonalEventsData, personalEventsData } = usePersonalEvents()
    const router = useRouter()
    const { showAlert } = useAlert()


    async function handleSubmit() {
        if (personalEventsData.title === "" || personalEventsData.main_title === "" || personalEventsData.descricao === "") {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            const response = await Api.insertPersonalLocalEvent(personalEventsData.day, personalEventsData.month, personalEventsData.year, personalEventsData.title, personalEventsData.descricao, personalEventsData.color, personalEventsData.main_title, personalEventsData.isImportant, personalEventsData.hora)

            if (response.data.code === "EVENT_ADDED") {
                showAlert("Evento adicionado com sucesso", "success");
                setPersonalEventsData((prev) => ({
                    ...prev,
                    title: "",
                    main_title: "",
                    descricao: "",
                    color: "#7685f5",
                    isImportant: false,
                    hora: "14:30",
                }))
                onClose();
                router.reload()
            }
        } catch (error) {
            console.log(error);
            alert("Erro ao criar evento");

        }

    }


    if (!isVisible) return null; // não renderiza nada se não for visível

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>
                    X
                </button>
                <div className={styles.row}>
                    <label>
                        Título
                        <input
                            onChange={(e) =>
                                setPersonalEventsData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            type="text"
                        />
                    </label>
                    <label>
                        Nome
                        <input onChange={(e) =>
                            setPersonalEventsData((prev) => ({
                                ...prev,
                                main_title: e.target.value,
                            }))
                        } type="text" />
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Descrição
                        <textarea onChange={(e) =>
                            setPersonalEventsData((prev) => ({
                                ...prev,
                                descricao: e.target.value,
                            }))
                        } name="" id=""></textarea>
                    </label>
                </div>
                <div className={styles.row}>
                    <label>
                        Data
                        <input
                            readOnly
                            type="date"
                            value={`${personalEventsData.year}-${padZero(+personalEventsData.month + 1).toString()}-${padZero(+personalEventsData.day).toString()}`}
                        />
                    </label>
                    <label>
                        Hora
                        <input
                            type="time"
                            onChange={(e) =>
                                setPersonalEventsData((prev) => ({
                                    ...prev,
                                    hora: e.target.value,
                                }))}
                            defaultValue="14:30" step="60" />
                    </label>
                </div>
                <div className={styles.row}>
                    <label className={styles.colorPicker}>
                        Cor
                        <input
                            onChange={(e) =>
                                setPersonalEventsData((prev) => ({
                                    ...prev,
                                    color: e.target.value,
                                }))} style={{ paddingLeft: 0 }} type="color" defaultValue="#7685f5" />
                    </label>
                    <label className={styles.checkbox}>
                        <input
                            onChange={(e) =>
                                setPersonalEventsData((prev) => ({
                                    ...prev,
                                    isImportant: e.target.checked,
                                }))} type="checkbox" />
                        Importante
                    </label>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancel} onClick={onClose}>
                        CANCELAR
                    </button>
                    <button onClick={() => handleSubmit()} className={styles.create}>CRIAR</button>
                </div>
            </div>
        </div>
    );
}