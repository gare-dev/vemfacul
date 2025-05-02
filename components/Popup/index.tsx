import s from "@/styles/popup.module.scss"


interface props {
    isVisible: boolean
    setIsVisible: () => void
}

export default function Popup(props: props) {

    return (
        props.isVisible &&
        (<div className={s.mainDiv}>
            <div className={s.popupBox}> </div>
        </div>)
    );

}