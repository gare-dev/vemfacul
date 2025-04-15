type InputText = {
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title?: string
    subtitle?: string;
    niveis?: string[];

}

export default InputText;