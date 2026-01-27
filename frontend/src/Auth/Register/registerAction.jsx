import { redirect } from "react-router-dom";

export async function registerAction({request}) {
    const formData = await request.formData();
    const userInput = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        cpassword: formData.get('cpassword'),
    }
    
    const res = await fetch('/api/v1/register', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(userInput)})
    console.log(res.status);

    if (res.status == 201) {
        return redirect('/dashboard')
    }

    const data = await res.json()
    console.log(data);

    return {status: res.status, data}
    

}