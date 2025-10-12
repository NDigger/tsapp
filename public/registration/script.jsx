import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchUserData, backendHost } from '/main';

const Registration = () => {    
    React.useEffect(() => {
        const fetchData = async () => {
            const d = await fetchUserData();
            if (d) window.location.href = '/profile/index.html'
        };
        fetchData();
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        const { firstName, lastName, email, password } = e.target.elements;
        try {
            const response = await fetch(`${backendHost}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    password: password.value
                })
            })
            if (response.ok) {
                window.location.href = '/profile/index.html'
            }
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <>
            <h1>--- Registration form ---</h1>
            <form onSubmit={onSubmit} action='http://localhost:3000/api/user' method='POST'>
                <p>First name:</p>
                <input id='first-name' placeholder='First Name (required)' min='3' type='text' name='firstName' autoComplete='given-name' />
                <p>Last name:</p>
                <input id='last-name' placeholder='Last Name (required)' type='text' name='lastName' autoComplete='family-name' />
                <p>Email:</p>
                <input id='email' placeholder='Email (required)' type='email' name='email' autoComplete='off' />
                <p>Password:</p>
                <input id='password' placeholder='Password (required)' type='password' name='password' autoComplete='current-password'/> 
                <button type='submit'>Register</button>
            </form>
        </>
    )
}
const root = createRoot(document.getElementById('root'))
root.render(<React.StrictMode><Registration /></React.StrictMode>)