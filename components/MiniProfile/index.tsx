import { MdOutlineLocationOn } from "react-icons/md";

import s from "@/styles/miniprofile.module.scss";

export default function MiniProfile() {
    return (
        <div className={s.mainDiv}>
            <div className={s.imageDiv}>
                <img src="/assets/img/euetec.jpg" alt="" />
            </div>
            <div className={s.nameDiv}>
                <p>Guilherme Garé</p>

            </div>
            <div className={s.schoolDiv}>
                <p>ETEC JORGE STREET</p>
            </div>
            <div className={s.locationDiv}>

                <p><MdOutlineLocationOn className={s.icon} />SP</p>
            </div>
            <div className={s.subjectsDiv}>
                <p>FÍSICA, QUÍMICA</p>
            </div>

        </div>
    )

}