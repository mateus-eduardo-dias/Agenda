import { redirect } from "react-router-dom";

export async function registerAction({request}) {
    const formData = await request.formData();
    const userInput = {
        email: formData.get('email'),
        password: formData.get('password'),
        cpassword: formData.get('cpassword'),
    }
    
    const res = await fetch('/api/v1/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: userInput})
    console.log(res.status);
    const data = await res.json();
    console.log(data);
    return redirect('/request-made')

}