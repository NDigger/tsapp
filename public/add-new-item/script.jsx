import React from 'react';
import { createRoot } from 'react-dom/client';
import { backendHost } from '../main';

const App = () => {
    const [errorText, setErrorText] = React.useState('');

    const onSubmit = e => {
        e.preventDefault()
        const { name, image, material, price, sizeCountXS, sizeCountS, 
            sizeCountL, sizeCountXL, sizeCountXXL, sizeCountXXXL } = e.target.elements;
        const returnZeroIfNaN = scv => isNaN(scv) ? 0 : scv;
        const sizeCountValue = {
            XS: returnZeroIfNaN(parseInt(sizeCountXS.value)),
            S: returnZeroIfNaN(parseInt(sizeCountS.value)),
            L: returnZeroIfNaN(parseInt(sizeCountL.value)),
            XL: returnZeroIfNaN(parseInt(sizeCountXL.value)),
            XXL: returnZeroIfNaN(parseInt(sizeCountXXL.value)),
            XXXL: returnZeroIfNaN(parseInt(sizeCountXXXL.value))
        }
        if (name.value === '') { setErrorText('Item must have a name'); return}
        if (!image.files[0]) { setErrorText('Item must have an image loaded'); return}
        if (material.value === '') { setErrorText('Item material must be included'); return}
        if (price.value === '') { setErrorText('Item must have a price'); return}
        if (sizeCountValue.XS
            + sizeCountValue.S
            + sizeCountValue.L
            + sizeCountValue.XL
            + sizeCountValue.XXL
            + sizeCountValue.XXXL === 0
        ) { setErrorText('Item count must be included'); return}
        const formData = new FormData();
        formData.append('image', image.files[0]);
        formData.append('name', name.value);
        formData.append('material', material.value);
        formData.append('price', Math.max(0, parseFloat(price.value)));
        formData.append('sizeCountXS', sizeCountValue.XS);
        formData.append('sizeCountS', sizeCountValue.S);
        formData.append('sizeCountL', sizeCountValue.L);
        formData.append('sizeCountXL', sizeCountValue.XL);
        formData.append('sizeCountXXL', sizeCountValue.XXL);
        formData.append('sizeCountXXXL', sizeCountValue.XXXL);
        if ((image.files[0].size / 1024 / 1024).toFixed(2) > 1) {
            setErrorText('Max file size is 1MB')
            return
        }
        const img = new Image();
        img.src = URL.createObjectURL(image.files[0]);
        img.onload = () => {
            const [w, h] = [img.naturalWidth, img.naturalHeight];
            const minResolution = { w: 128, h:128 };
            if (w < minResolution.w || h < minResolution.h) {
                setErrorText(`Min resolution is ${minResolution.w}x${minResolution.h}`)
                return
            } else if (w / h > 2) {
                setErrorText(`Width can't be more than 2× height. Current resolution: ${w}x${h}`)
                return
            } else if (h / w > 2) {
                setErrorText(`Height can't be more than 2× width. Current resolution: ${w}x${h}`)
                return
            }
            fetch(`${backendHost}/api/items`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            .then(async res => {
                if (res.status === 400) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                } else if (res.ok) {
                    setErrorText('');
                    window.location.href = '/seller-items/index.html'
                }
            })
            .catch(e => {
                console.error(e)
                setErrorText(e.message)
            })
        };
    }
    return (
        <form onSubmit={onSubmit} id='add-new-item' className='tab'>
            <h1>Add new item!</h1>
            <div className='field'>
                <label htmlFor='item-name'>Item name</label>
                <input type='text' id='item-name' name='name' />
            </div>
            <div className='field'>
                <label htmlFor='item-image'>Item image</label>
                <input type='file' id='item-image' name='image' accept='image/*' />
            </div>
            <div className='field'>
                <label htmlFor='item-material'>Item material</label>
                <input type='text' id='item-material' name='material' />
            </div>
            <div className='field'>
                <label htmlFor='item-price'>Item price (USD)</label>
                <input placeholder='0' onInput={e => e.target.value = Math.max(0, Number(e.target.value))} type='number' id='item-price' name='price' />
            </div>
            <h2>Sizes & Quantity</h2>
            <div className='field size-field'>
                <label htmlFor='size-xs'>XS:</label>
                <input placeholder="0" type="number" min='1' name="sizeCountXS" id="size-xs" />
            </div>
            <div className='field size-field'>
                <label htmlFor='size-s'>S:</label>
                <input  placeholder="0" type="number" min='1' name="sizeCountS" id="size-s" />
            </div>
            <div className='field size-field'>
                <label htmlFor='size-l'>L:</label>
                <input  placeholder="0" type="number" min='1' name="sizeCountL" id="size-l" />
            </div>
            <div className='field size-field'>
                <label htmlFor='size-xl'>XL:</label>
                <input  placeholder="0" type="number" min='1' name="sizeCountXL" id="size-xl" />
            </div>
            <div className='field size-field'>
                <label htmlFor='size-xxl'>XXL:</label>
                <input  placeholder="0" type="number" min='1' name="sizeCountXXL" id="size-xxl" />
            </div>
            <div className='field size-field'>
                <label htmlFor='size-xxxl'>XXXL:</label>
                <input  placeholder="0" type="number" min='1' name="sizeCountXXXL" id="size-xxxl" />
            </div>
            <p id='error-msg'>{errorText}</p>
            <button id='publish-btn' type='submit'>Publish</button>
        </form>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)