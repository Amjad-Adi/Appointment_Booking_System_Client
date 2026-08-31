import type { InputHTMLAttributes } from "react";

export interface InputModel
    extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({className = "", ...props}: InputModel) {
    return (<input className={` box-border w-full  h-11 px-3 py-2 rounded-lg border border-slate-300 bg-white
      text-[0.95rem] font-['Inter',_sans-serif]  text-slate-800 placeholder:text-slate-400 outline-none
        transition duration-200 hover:border-slate-400 focus:border-violet-500 focus:ring-2  
        focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:bg-slate-100  
         disabled:text-slate-500${className}`}{...props}/>);
}