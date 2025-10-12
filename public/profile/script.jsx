import React from 'react';
import { createRoot } from 'react-dom/client';
import { getRoleName, backendHost } from '/main.js';
import { base64ImageEntry } from '../main';

const testLocationInput = element => {
    if (element.value === '') {
        element.style.border = '1px solid red';
        return false;
    } else {
        element.style.border = '';
        return true;
    }
}

const UserProfile = () => {
    const [userLocation, setUserLocation] = React.useState({});
    const [editingModeEnabled, setEditingModeEnabled] = React.useState(false);
    const [user, setUser] = React.useState({});
    const [changePasswordModalVisible, setChangePasswordModalVisible] = React.useState(false)

    React.useEffect(() => {
        fetch(`${backendHost}/api/location`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(d => setUserLocation(d))
        .catch(e => console.error(e));

        fetch('http://localhost:3000/api/user', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(d => {
            setUser(d)
            document.title = `${d.firstName} ${d.lastName}'s profile`
        })
    }, [])

    const onInputPsc = e => e.currentTarget.value = e.currentTarget.value.slice(0, 10);

    const onClickLogout = () => {
        fetch(`${backendHost}/api/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => {
            console.log(res.json())
            if (res.ok) {
                window.location.href = '/offers/index.html'
            }
        })
        .catch(e => console.error(e))
    } 

    const handleSubmitLocation = e => {
        e.preventDefault()
        if (!editingModeEnabled) {
            setEditingModeEnabled(!editingModeEnabled)
            return
        }
        const { street, place, psc } = e.target.elements;
        const tests = [
            testLocationInput(street),
            testLocationInput(place),
            testLocationInput(psc)
        ]
        if (tests.includes(false)) return
        setEditingModeEnabled(!editingModeEnabled)
        fetch(`${backendHost}/api/location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                street: street.value,
                place: place.value,
                psc: psc.value,
            })
        })
        .then(res => res.json())
        .then(d => setUserLocation(d))
    }

    const onClickDeleteProfile = () => {
        fetch(`${backendHost}/api/user`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) window.location.href = '/offers/index.html'
        })
    }

    const onChangePasswordSubmit = e => {
        e.preventDefault()
        const [oldPassword, newPassword] = e.target.elements
        fetch(`${backendHost}/api/user/password`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: oldPassword.value,
                newPassword: newPassword.value
            })
        })
            .then(async res => {
            if (res.ok) window.location.reload();
        })
    }
    return (
        <section id='profile-info' className='tab'>
            <h1>Your profile</h1>
            <div className='info-container'>
                <p>ID:</p>
                <p>{user.id}</p>
            </div>
            <div className='info-container'>
                <p>Full Name:</p>
                <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className='info-container'>
                <p>Email:</p> 
                <p>{user.email}</p>
            </div>
            <div className='info-container'>
                <p>Role:</p> 
                <p>{getRoleName(user.role)}</p>
            </div>
            <h2>Your Location</h2>
            <form onSubmit={handleSubmitLocation}>
                <div className='info-container'>
                    <p>Street:</p>
                    <p>{!editingModeEnabled ? userLocation.street || 'Not Specified' : <input defaultValue={userLocation.street} type='text' name='street' className='edit-input' minLength='1' maxLength='64'/>}</p>
                </div>
                <div className='info-container'>
                    <p>Place:</p>
                    <p>{!editingModeEnabled ? userLocation.place || 'Not Specified' : <input defaultValue={userLocation.place} type='text' name='place' className='edit-input' minLength='1' maxLength='64'/>}</p>
                </div>
                <div className='info-container'>
                    <p>PSC:</p>
                    <p>{!editingModeEnabled ? userLocation.psc || 'Not Specified' : <input defaultValue={userLocation.psc} type='number' name='psc' className='edit-input' onInput={onInputPsc} />}</p>
                </div>
                <div className='bottom-buttons'>
                    <button type='submit'>{!editingModeEnabled ? 'Edit Location' : 'Confirm'}</button>
                    <button onClick={() => setChangePasswordModalVisible(!changePasswordModalVisible)} type='button'>Change password</button>
                    <button onClick={onClickDeleteProfile} type='button' className='red-btn'>Delete profile</button>
                    <button onClick={onClickLogout} className='red-btn' type='button'>Logout</button>
                </div>
            </form>
            <div id='change-password-modal' style={{display: changePasswordModalVisible ? 'flex' : 'none'}}>
                <form onSubmit={onChangePasswordSubmit} className='window'>
                    <h1>Password change</h1>
                    <div>
                    <label htmlFor="old-password">Old password</label>
                    <input type="text" name="oldPassword" id="old-password" />
                    </div>
                    <div>
                        <label htmlFor="new-password">New password</label>
                        <input type="text" name="newPassword" id="new-password" />
                    </div>
                    <button type='submit'>Submit</button>
                    <button onClick={() => setChangePasswordModalVisible(false)} type='button' className='close'>Close</button>
                </form>
            </div>
        </section>
    )
}

const OrderItem = ({data}) => {
    return (
        <tr className='order-item'>
            <td>{data.item_id}</td>
            <td>
                <img className='item-image' src={`${base64ImageEntry} ${data.itemData.imageBase64}`} alt='T-Shirt Image' />
            </td>
            <td>{data.itemData.name}</td>
            <td>{data.quantity}</td>
            <td>${data.quantity * data.itemData.price}</td>
        </tr>
    )
}

const getOrderDate = d => {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}

const getOrderPrice = items => items.reduce((sum, item) => sum + item.quantity * item.itemData.price, 0);

const Order = ({data}) => {
    const [itemsVisible, setItemsVisible] = React.useState(false);
    const handleClick = () => setItemsVisible(!itemsVisible)
    return (
        <div className='order'>
            <div className='order-tab'>
                <div className='order-info'>
                    <p>Order id: {data.id}</p>
                    <p>${getOrderPrice(data.items)}</p>
                </div>
                <button onClick={handleClick} className='show-items-btn' style={{
                    transform: itemsVisible ? 'rotate(180deg)' : 'rotate(270deg)'
                }}>🠉</button>
            </div>
            <div className='order-items-tab' style={{
                    display: itemsVisible ? 'block' : 'none',
                    }}>
                <div className='additional-order-info'>
                    <p>Ordered at: {getOrderDate(data.order_date)}</p>
                    <p>Status: Recieved {/* TO DO */}</p>
                </div>
                <table id='items-container'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, i) => <OrderItem data={item} key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const UserOrders = () => {
    const [orders, setOrders] = React.useState([]);
    
    React.useState(() => {
    fetch(`${backendHost}/api/order`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(d => {
            setOrders(d);
        })
        .catch(e => console.error(e));
    }, []);

    return (
        <section id='orders' className='tab'>
            <h1>Your orders:</h1>
            {
            !orders.length
            ?   <>
                    <p>You don't have any orders yet!</p>
                    <p>Come get something!</p>
                </>
            : orders.map((order, i) => <Order data={order} key={i} />)
            }
        </section>
    )
}

const App = () => {
    return (
        <>
            <UserProfile />
            <UserOrders />
        </>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
