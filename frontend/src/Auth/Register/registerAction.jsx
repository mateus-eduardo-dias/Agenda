export async function registerAction({request}) {
    const formData = await request.formData();
    const userInput = {
        email: formData.get('email'),
        password: formData.get('password'),
        cpassword: formData.get('cpassword'),
    }
    console.log(userInput)
}