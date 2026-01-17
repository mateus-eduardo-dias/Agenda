import { Form, useActionData } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import './Register.css'

export default function Register() {

    const error = useActionData();

    const [showPassword, setShowPassword] = useState(false);

    function handlePasswordButton() {
        setShowPassword(sp => !sp);
    }

    return (
        <>
        <h1 className="space-grotesk-bold">Join Agenda today</h1>
        <section>
            <article>
                <h2 className="fira-sans-bold">Create your Agenda account</h2>
                <Form action="/register" method="POST">
                    <div className="form-grid">
                        <label className="space-grotesk-regular" htmlFor="firstName" id="firstNameLabel">First Name</label>
                        <input name="firstName" type="text" id="firstName"/>
                        <label className="space-grotesk-regular" htmlFor="lastName" id="lastNameLabel">Last Name</label>
                        <input name="lastName" type="text" id="lastName"/>
                    </div>
                    <label className="space-grotesk-regular" htmlFor="email">Email</label>
                    <input name="email" type="email" id="email"/>
                    <label className="space-grotesk-regular" htmlFor="password">Password</label>
                    <input name="password" type={showPassword ? 'text' : 'password'} id="password" />
                    {showPassword ? <Eye onClick={handlePasswordButton} /> : <EyeOff onClick={handlePasswordButton} />}
                    <label className="space-grotesk-regular" htmlFor="cpassword">Confirm Password</label>
                    <input name="cpassword" type="password" id="cpassword" />
                    <button type="submit" className="fira-sans-regular">Register</button>
                </Form>
            </article>
        </section>
        </>
    );
}