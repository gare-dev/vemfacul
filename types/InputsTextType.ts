type InputText = {
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title?: string
    subtitle?: string;
    opcoes?: string[];
    level?: string;

}

export default InputText;