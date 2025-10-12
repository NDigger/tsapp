import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchUserData, backendHost } from '/main';

const Login = () => {
    const [status, setStatus] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            const d = await fetchUserData();
            if (d) window.location.href = '/profile/index.html'
        };
        fetchData();
    }, []);

    const onSubmit = async e => {
        e.preventDefault()
        setStatus("")
        const { email, password } = e.target.elements;
        const params = new URLSearchParams({
            email: email.value,
            password: password.value
        });
        const response = await fetch(`${backendHost}/api/user/by-login?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })
        if (response.status === 200) {
            const nextPage = sessionStorage.getItem('saved-page') ?? '/profile/index.html';
            sessionStorage.removeItem('saved-page');
            window.location.href = nextPage;
        }
        else if (response.status === 401) setStatus('The login or the password is wrong.');
        else if (response.status === 500) setStatus(response.statusText);
    }
    return(
        <>
            <h1>--- Login form ---</h1>
            <form onSubmit={onSubmit} action='POST'>
                <p>Email:</p>
                <input placeholder='Email (required)' type='email' name='email' />
                <p>Password:</p>
                <input placeholder='Password (required)' type='password' name='password' autoComplete='current-password' /> 
                <p>{status}</p>
                <button type='submit'>Login</button>
            </form>
        </>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>
    )
