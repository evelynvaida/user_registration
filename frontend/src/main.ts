import './style.css';
import { z } from "zod";
import { safeFetch } from './safeFetch';

const emailInput = document.getElementById("email-input") as HTMLInputElement
const createPasswordInput = document.getElementById("create-password-input") as HTMLInputElement
const confirmPasswordInput = document.getElementById("confirm-password-input") as HTMLInputElement
const signupButton = document.getElementById("signup-btn") as HTMLInputElement
const appElement = document.getElementById("app") as HTMLElement;

const isEmailValid = (email: string) => {
    return email.includes('@') && email.includes('.');
}

const updateEmailFieldStyle = () => {
    if (isEmailValid(emailInput.value)) {
        emailInput.style.borderColor = 'green'
    } else {
        emailInput.style.borderColor = 'red'
        alert('Please enter a valid email address. It should contain "@" and "." symbols')
    }
}

const isPasswordValid = (password: string) => {
    return password.length >= 5;
}

const updateCreatePasswordStyle = () => {
    if (isPasswordValid(createPasswordInput.value)) {
        createPasswordInput.style.borderColor = 'green'
    } else {
        createPasswordInput.style.borderColor = 'red'
        alert('Please enter a password with at least 5 characters')

    }
}

const updateConfirmPasswordStyle = () => {
    if (confirmPasswordInput.value === createPasswordInput.value) {
        confirmPasswordInput.style.borderColor = 'green'
    } else {
        confirmPasswordInput.style.borderColor = 'red'
        alert('The confirmation password must match the created password')
    }
}

const ifSignupSuccesful = () => {
    appElement.innerHTML = ''

    const successMessage = document.createElement('div')
    successMessage.textContent = 'Successful registration!'

    const backButton = document.createElement('button')
    backButton.textContent = 'Back to main page'
    backButton.addEventListener('click', showFormAgain)
    backButton.classList.add('btn', 'btn-primary', 'm-2');

    appElement.appendChild(successMessage)
    appElement.appendChild(backButton)
}

const showFormAgain = () => {
    appElement.innerHTML = ''
    appElement.appendChild(emailInput)
    appElement.appendChild(createPasswordInput)
    appElement.appendChild(confirmPasswordInput)
    appElement.appendChild(signupButton)
}

const allFieldsAreValid = () => {
    return isPasswordValid(createPasswordInput.value) &&
        confirmPasswordInput.value === createPasswordInput.value &&
        emailInput.value.includes('@') && emailInput.value.includes('.')
}


emailInput.addEventListener('input', updateEmailFieldStyle)
createPasswordInput.addEventListener('input', updateCreatePasswordStyle)
confirmPasswordInput.addEventListener('input', updateConfirmPasswordStyle)


const postData = async () => {
    if (!allFieldsAreValid()) {
        alert('The email or password you entered did not match the requirements')
        return
    }
    const response = await safeFetch("post",
        `http://localhost:4003/api/users`,
        {
            email: emailInput.value,
            createpassword: createPasswordInput.value,
            confirmpassword: confirmPasswordInput.value
        })
    if (response?.status === 200) {
        ifSignupSuccesful()
    } else if (response?.status === 409) {
        alert("The email is already registered. Please use a different email address.");
    } else {
        alert("An error occurred.");
    }
}

signupButton.addEventListener("click", async () => {
    await postData();
})
