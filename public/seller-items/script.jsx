import React from 'react';
import { createRoot } from 'react-dom/client';
import { backendHost } from '../main.js';

const Item = ({ data }) => {
    return (
        <a className='item-card' href={`/seller-item-page/index.html?${new URLSearchParams({itemId: data.id}).toString()}`}>
            <img src={data.imageBase64 ? `data:image/png;base64, ${data.imageBase64}` : null} alt="item-image" />
            <div className='bottom-left'>
                <p className='item-count'>Items left: {data.sizes.reduce((sum, size) => sum + size.quantity, 0)}</p>
                <p className='name'>Name: {data.name}</p>
            </div>
            <p className='price'>${data.price}</p>
        </a>
    )
}

const getItems = data => {
    const elements = [];
    data.map((d, i) => {
        if (d.sizes.some(size => size.quantity > 0)) {
            elements.push(<Item data={d} key={i}/>)
        }
    })
    return elements;
}

const App = () => {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch(`${backendHost}/api/seller/items`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(d => setItems(d))
    }, [])

    return(
        <>
            <h1>Your published items</h1>
            <div className='item-cards-container'>
                { 
                    getItems(items).length 
                    ? getItems(items) 
                    : <p>You don't have any items published!</p>
                }
            </div>
        </>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
    )
