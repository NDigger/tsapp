import React from 'react';
import { createRoot } from 'react-dom/client'
import { backendHost, base64ImageEntry } from '../main';

const Item = ({data, removeItem}) => {
    return (
        <tr className='cart-item'>
            <td>{data.item_name}</td>
            <td>
                <img src={`${base64ImageEntry} ${data.imageBase64}`} alt='T-Shirt Image' />
            </td>
            <td>{data.quantity}</td>
            <td>{data.item_size}</td>
            <td>${data.price * data.quantity}</td>
            <td><button onClick={() => removeItem(data.sized_item_id)}>Remove</button></td>
        </tr>
    )
}

const Cart = () => {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch(`${backendHost}/api/cart`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(d => setItems(d));
    }, [])

    const removeItem = sizedItemId => {
        fetch(`${backendHost}/api/cart/${sizedItemId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(d => setItems(d));
    }

    const handleClick = () => {
        let sendItems = items.slice();
        sendItems.forEach(item => delete item.imageBase64);
        console.log(sendItems);
        fetch(`${backendHost}/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: sendItems,
            }),
            credentials: 'include'
        })
        
        .then(res => {
            if (res.ok) window.location.href = '/offers/index.html';
        })
    }

    return (
        <section id='cart' className='tab'>
            <h1>Your items</h1>
            { items.length ?
                <table id='items-container'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Quantity</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => <Item data={item} key={i} removeItem={removeItem} />)}
                </tbody>
            </table>
                : <p id='no-items-msg'>You don't have items added yet!</p>
            }
            {items.length ? 
                <>
                    <p id='total-price'>Total Price: ${items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
                    <button onClick={handleClick} id='purchase-btn'>Purchase</button>
                </>
                : <a id='offers-page-link' href='/offers/index.html'>Shop</a>
            }
        </section>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Cart />
    </React.StrictMode>
)