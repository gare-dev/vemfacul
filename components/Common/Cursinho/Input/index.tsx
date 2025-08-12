import { ChangeEvent, HTMLInputTypeAttribute } from "react"
import styles from "./input.module.scss"

interface props {
    type?: HTMLInputTypeAttribute
    required?: boolean
    name: string
    label: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    maxLength?: number

}


const Input = ({ type, required, name, value, onChange, label, maxLength }: props) => {
    return (

        <div className={styles.inputGroup}>

            <input maxLength={maxLength ?? 200} id={name} name={name} onChange={onChange} value={value} type={type} required={required}>
            </input>
            <label htmlFor={name}>{label}</label>
        </div>
    )
}

export default Input