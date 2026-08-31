import type { InputHTMLAttributes } from "react";

export interface CheckboxModel
    extends InputHTMLAttributes<HTMLInputElement> {
    type?: "checkbox";
}

export function Checkbox({type = "checkbox", ...props}: CheckboxModel) {
    return (<input type={type}{...props}/>);
}