import React from 'react';
import { createRoot } from 'react-dom/client';
import { backendHost } from "/main";
import { base64ImageEntry } from '../main';

const getItemIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('itemId')
}

const Item = ({ data }) => {
    const handleItemRemovement = () => {
        const itemId = getItemIdFromURL();
        fetch(`${backendHost}/api/seller/item/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                window.location.href = '/seller-items/index.html'
            }
        })
    }
    
    return (
        <div id='item-container'>
            <img id='item-image' className='image' src={data.imageBase64 ? `${base64ImageEntry} ${data.imageBase64}` : null} alt='T-Shirt Image' />
            <div id='item-info'>
                <h1 id='name'>{data.name}</h1>
                <p id='price'>Price: ${data.price}</p>
                <p id='material'>Material: {data.material}</p>
                <p id='sizes-avaliable'>Sizes avaliable:</p>
                {(data.sizes ?? []).map((size, i) => <p key={i}>{size.name}: {size.quantity}</p>)}
                <button onClick={handleItemRemovement} id='remove-item-btn'>Remove item</button>
            </div>
        </div>
    )
}

const App = () => {
    const [item, setItem] = React.useState({});
    
    React.useEffect(() => {
        const itemId = getItemIdFromURL();
        fetch(`${backendHost}/api/seller/item/${itemId}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(d => setItem(d))
        .catch(err => console.error(err));
    }, []);

    return (
        item ? <Item data={item} /> : <p>Not found</p>
    )
}
const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)