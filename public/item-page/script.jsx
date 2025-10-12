import React from 'react';
import { createRoot } from 'react-dom/client';
import { fetchUserData } from "/main";
import { backendHost, base64ImageEntry } from '../main';

const App = () => {
    const quantityInput = React.useRef();
    const [item, setItem] = React.useState({});
    const [userData, setUserData] = React.useState({});
    const [selectedSizedItem, setSelectedSizedItem] = React.useState({});    

    React.useEffect(() => {
        const fetchData = async () => {
            const d = await fetchUserData();
            setUserData(d);
        };
        fetchData();

        const itemId = new URLSearchParams(window.location.search).get('itemId');
        fetch(`${backendHost}/api/items/${itemId}`)
        .then(res => res.json())
        .then(d => {
            setItem(d)
            document.title = d.name
        });
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        if (!userData) {
            sessionStorage.setItem('saved-page', window.location.href)
            window.location.href = '/login/index.html'
        } else if (Object.keys(selectedSizedItem).length === 0) {
            alert('Select size first!')
        } else {
            const { quantity } = e.target.elements;
            fetch(`${backendHost}/api/cart`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sizedItem: selectedSizedItem, quantity: Math.min(Number(quantity.value), selectedSizedItem.quantity) })
            })
            .then(res => {
                if (res.ok) {
                    window.location.replace('/offers/index.html')
                }
            })
        }
    }

    const selectOnChange = e => {
        const size = item.sizes.find(size => size.name === e.target.value);
        quantityInput.current.value = '1';
        setSelectedSizedItem(size);
    }

    return (
        <form onSubmit={onSubmit} id='item-container'>
            <img id='item-image' className='image' src={`${base64ImageEntry} ${item.imageBase64}`} alt='T-Shirt Image' />
            <div id='item-info'>
                <div>
                    <h1 id='item-name'>Name: {item.name}</h1>
                    <p id='item-material'>Material: {item.material}</p>
                    <p id='item-price'>${item.price}</p>
                </div>
                { (item.user_id !== (userData ? userData.id : -1)) ? 
                <div id='quantity-add-container'>
                    <select defaultValue='' onChange={selectOnChange} name='item-sizes' id='item-sizes'>
                        <option value='' disabled>Sizes</option>
                        {(item.sizes ?? []).map((size, i) => <option value={size.name} key={i}>{size.name}</option>)}
                    </select>
                    <input ref={quantityInput} name='quantity' onInput={e => e.target.value = Math.min(Number(e.target.value), selectedSizedItem.quantity)} type='number' id='quantity' min='1' max={selectedSizedItem.quantity} />
                    <button type='submit' id='add-to-cart-btn'>Add to Cart</button>
                </div>
                :
                <p>It's your item. You can't buy it.</p>
                }
            </div>
        </form>
    )
}
const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)