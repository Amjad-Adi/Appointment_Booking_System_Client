import icon from "../../../assets/images/icons/icon.png";
import googleLogo from "../../../assets/images/login-images/google-logo.svg";

import {TextField} from "../../../components/TextField.tsx";
import {CheckboxField} from "../../../components/CheckBoxField.tsx";
import {Image} from "../../../components/Image.tsx";
import {Button} from "../../../components/Button.tsx";
import {Link} from "react-router";
import * as React from "react";
import {useState} from "react";
import {apiService} from "../../../services/api.ts";


export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <main
            className="bg-[#e9e9f1] w-[30%] h-[90%] rounded-[20px] border-[3px] border-solid border-[#8500ca]">
            <form
                className="flex flex-col justify-around items-center p-[2vw] h-full" onSubmit={LoginWithAccount}>
                <Image src={icon} alt="Smart Appointment Booking icon" className="w-[5vw] h-[5vw] rounded-full "/>
                <p className=" text-[1.5vw] font-extrabold text-center">Appointment Booking System</p>
                <p
                    className=" font-[Poppins,serif] text-[1vw] text-center font-bold ">
                    Sign in to manage your appointments and organizations
                </p>

                <TextField label="email" name="Email" type="email" placeholder="Enter your Email" onChange={(event) => {
                    setEmail(event.target.value)
                }} isLabelDisabled={true}/>
                <TextField label="password" name="Password" type="password" placeholder="Enter your Password"
                           onChange={(event) => {
                               setPassword(event.target.value)
                           }} isLabelDisabled={true}/>

                <div
                    className=" flex justify-between  w-[90%] text-[0.8rem] font-['Inter',serif] no-underline transition-colors duration-200 ">
                    <CheckboxField label="Remember me" name="remember"/>
                    <Link to="/forget-password" className="hover:underline">Forgot Password?</Link>
                </div>

                <Button type="submit" className=" hover:bg-[#1461ca] hover:translate-y-[-2px]">Sign In</Button>
                <section className="flex items-center gap-4 w-[90%] ">
                    <span className="flex-1 h-px bg-[#ccc]"/>
                    <span className="text-[0.9rem] text-[#777]">Or</span>
                    <span className="flex-1 h-px bg-[#ccc]"/>
                </section>

                <a href="https://google.com"
                   className="flex items-center justify-center bg-white border border-solid rounded-[0.5vw] gap-2 text-[1.1vw] font-bold no-underline w-[90%]  h-[8%] transition-transform duration-200 hover:translate-y-[-2px]">
                    <Image src={googleLogo} alt="Google icon"/>
                    <p>Continue With Google</p>
                </a>

                <section
                    className="flex justify-center items-center gap-2 w-[90%] ">
                    <p className="text-[1.1vw] font-medium ">Don't have an account?</p>
                    <Link to="/register" className=" text-[1.1vw] font-bold no-underline hover:underline">Create
                        Account</Link>
                </section>
            </form>
        </main>
    );

    async function LoginWithAccount(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await apiService(
            "auth/login",
            {
                method: "POST",
                body: {
                    email: email,
                    password: password
                }
            }
        )
        return response;
    }
}
