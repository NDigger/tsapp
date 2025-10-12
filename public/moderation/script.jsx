import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchUserData, backendHost, getRoleName } from '/main.js';

const App = () => {
    const [data, setData] = React.useState({});
    const [role, setRole] = React.useState({});
    const [status, setStatus] = React.useState('');

    const onFindUserSubmit = e => {
        e.preventDefault()
        const userId = e.target.elements.userId.value
        fetch(`${backendHost}/api/user/${userId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json()
            else throw new Error('Not found')
        })
        .then(d => {
            setData(d)
            setRole(d.role)
        })
        .catch(e => {
            setStatus(e.message)
            setData({})
        })
    }

    const onEditUserSubmit = e => {
        e.preventDefault()
        const submitter = e.nativeEvent.submitter
        if (submitter.value === 'save') {
            fetch(`${backendHost}/api/user/${data.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: role
                })}
            )
            .then(res => {
                if (res.status === 200) setStatus('Saved')
                else setStatus(res.status)
                setTimeout(() => setStatus(''), 1000)
            })
        }
        else if (submitter.value === 'delete') {
            fetch(`${backendHost}/api/user/${data.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if (res.ok) window.location.reload()
                else setStatus(res.status)
            })
        }
    }

    return(
        <>
            <form id='find-user-form' onSubmit={onFindUserSubmit}>
                <input name='userId' type='number' placeholder='Enter user_id'/>
                <button type='submit'>/</button>
            </form>
            <form onSubmit={onEditUserSubmit} id='edit-user-form' style={{display: Object.keys(data).length === 0 ? 'none' : 'block'}}>
                <p>User Id: {data.id}</p>
                <p>Full Name: {data.firstName} {data.lastName}</p>
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="0">Purchaser</option>
                    <option value="1">Seller</option>
                    <option value="2">Moderator</option>
                </select>
                <button name='action' value='save' className='save' type='submit'>Save</button>
                <button name='action' value='delete' className='block' type='submit'>Delete user profile</button>
            </form>
            <p>{status}</p>
        </>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
    )
