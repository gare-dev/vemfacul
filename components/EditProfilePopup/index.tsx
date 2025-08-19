import Api from "@/api";
import styles from "@/styles/editprofilepopup.module.scss";
import { useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import LoadingComponent from "../LoadingComponent";

interface Props {
    closePopup: () => void;
    name?: string
    descricao?: string
    foto?: string
    header?: string
    refreshPage: () => void
}

type ProfileEdit = {
    nome?: string;
    foto?: File | null | Blob;
    header?: File | null | Blob
    descricao?: string
}


export default function EditProfilePopup(props: Props) {
    const [profile, setProfile] = useState<ProfileEdit>({
        descricao: props.descricao,
        foto: null,
        header: null,
        nome: props.name
    })
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        const userData = {
            name: profile.nome,
            descricao: profile.descricao
        }

        const formData = new FormData()
        formData.append('userData', JSON.stringify(userData))

        if (profile.foto instanceof File) {
            formData.append('foto', profile.foto)
        }

        if (profile.header instanceof File) {
            formData.append('header', profile.header)
        }

        try {
            setLoading(true)
            const response = await Api.editProfile(formData)

            if (response.data.code === "PROFILE_EDITED") {
                props.closePopup()
                props.refreshPage()
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }
    return (
        <>


            <div className={styles.editProfilePopup} onClick={props.closePopup}>
                {loading && (
                    <div style={{ position: "fixed", height: "100%", width: "100%", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 999999999999, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                        <LoadingComponent isLoading={loading} />
                    </div>
                )}
                <div className={styles.boxDiv} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.editHeader}>
                        <div className={styles.textDiv}>
                            <p onClick={props.closePopup} className={styles.close}>X</p>
                            <p>Editar Perfil</p>
                            <button onClick={handleSubmit}>Salvar</button>
                        </div>
                    </div>

                    <div className={styles.headerImage}>
                        <div>
                            <div className={styles.overlay}>
                                <label htmlFor="header-upload"><MdOutlineAddAPhoto color="#fff" size={"3em"} /></label>
                                <input style={{ display: "none" }} onChange={(e) => setProfile((prev) => ({
                                    ...prev,
                                    header: e.target.files?.[0]
                                }))} type="file" id="header-upload" />
                            </div>
                            <img src={
                                profile.header === null || profile.header === undefined
                                    ? props.header
                                    : typeof profile.header === "string"
                                        ? profile.header
                                        : URL.createObjectURL(profile.header)
                            } alt="" />
                        </div>
                    </div>

                    <div className={styles.profileImage}>
                        <div>
                            <div className={styles.overlay}>
                                <label htmlFor="foto-upload"><MdOutlineAddAPhoto color="#fff" size={"3em"} /></label>
                                <input style={{ display: "none" }} onChange={(e) => setProfile((prev) => ({
                                    ...prev,
                                    foto: e.target.files?.[0]
                                }))} type="file" id="foto-upload" />
                            </div>
                            <img
                                src={
                                    profile.foto === null || profile.foto === undefined
                                        ? props.foto
                                        : typeof profile.foto === "string"
                                            ? profile.foto
                                            : URL.createObjectURL(profile.foto)
                                }
                                alt=""
                            />
                        </div>
                    </div>

                    <div className={styles.profileInputs}>
                        <div className={styles.input}>
                            <label>Nome</label>
                            <input
                                value={profile.nome}
                                type="text"
                                maxLength={30}
                                defaultValue={props.name}
                                onChange={(e) =>
                                    setProfile((prev) => ({
                                        ...prev,
                                        nome: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className={styles.input}>
                            <label>Descrição</label>
                            <textarea defaultValue={props.descricao} maxLength={200} value={profile.descricao} onChange={(e) => setProfile((prev) => ({
                                ...prev,
                                descricao: e.target.value
                            }))}></textarea>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}
