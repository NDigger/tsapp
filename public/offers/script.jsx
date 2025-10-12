import React from 'react'
import { createRoot } from 'react-dom/client'
import { backendHost, base64ImageEntry } from '../main.js'

const getSizesList = sizes => sizes
    .filter(size => size.quantity > 0)
    .map(size => size.name)
    .join(', ');

const Sorts = () => {
    const onChange = e => {
        sessionStorage.setItem('sort', e.target.value)
        window.location.reload()
    }

    return (
        <div>
            <p>Sort:</p>
            <select name='sort' defaultValue={sessionStorage.getItem('sort') ?? ''} id='sort' onChange={onChange}>
                <option value=''>None</option>
                <option value='highest-price'>Highest Price</option>
                <option value='lowest-price'>Lowest Price</option>
                <option value='name'>Name</option>
                <option value='name-reverse'>Name Reverse</option>
            </select>
        </div>
    )
}

const FilterSizeButton = ({sizeName, filters, setFilters}) => {
    const updateSize = key => {
        let fs = structuredClone(filters);
        fs.sizes[key] = !fs.sizes[key];
        sessionStorage.setItem(`filter-size-${key}`, fs.sizes[key].toString());
        setFilters(fs);
        window.location.reload()
    }

    return (
        <button onClick={() => updateSize(sizeName)} className={filters?.sizes[sizeName] ? 'enabled' : ''}>{sizeName}</button>
    )
}

const PriceFilter = {
    MIN: 'min',
    MAX: 'max'
}

const Filters = ({filters, setFilters, filterCount}) => {
    const [filtersWindowVisible, setFiltersWindowVisible] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener('scroll', () => {
            setFiltersWindowVisible(false);
        })
    }, []);

    const updatePrice = (e, key) => {
        let fs = structuredClone(filters);
        fs.price[key] = Number(e.target.value);
        sessionStorage.setItem(`filter-price-${key}`, e.target.value ?? 0);
        setFilters(fs);
    }

    const onPriceInputKeydown = e => (e.key === 'Enter') && window.location.reload()

    return (
        <div id='filters-area'>
            <button id='filters-btn' onClick={() => setFiltersWindowVisible(!filtersWindowVisible)}>Filters {filterCount > 0 && `(${filterCount})`}</button>
            <div id='filters-window' style={{visibility: filtersWindowVisible ? 'visible' : 'hidden'}}>
                <p className='filter-title'>-- Sizes --</p>
                <div className='sizes'>
                    {
                    ['XS', 'S', 'L', 'XL', 'XXL', 'XXXL']
                    .map((sizeName, i) => <FilterSizeButton sizeName={sizeName} filters={filters} setFilters={setFilters} key={i}></FilterSizeButton>)
                    }
                </div>
                <p className='filter-title'>-- Pricing --</p>
                <div className='pricing-inputs'>
                    <p>$</p>
                    <input onBlur={() => window.location.reload()} onKeyDown={onPriceInputKeydown} onInput={e => updatePrice(e, PriceFilter.MIN)} value={filters.price.min !== 0 ? filters.price.min : ''} placeholder='min' type="number" />
                    <p>-</p>
                    <p>$</p>
                    <input onBlur={() => window.location.reload()} onKeyDown={onPriceInputKeydown} onInput={e => updatePrice(e, PriceFilter.MAX)} value={filters.price.max !== 0 ? filters.price.max : ''} placeholder='max' type="number" />
                </div>
            </div>
        </div>
    )
}

const FiltersAndSorts = ({filters, setFilters, filterCount}) => {
    return (
        <div id='filters-sorts'>
            <Sorts />
            <Filters filters={filters} setFilters={setFilters} filterCount={filterCount} />
        </div>
    )
}

const ItemCard = ({data}) => {
    return (
        <a className='item-card' href={`/item-page/index.html?${new URLSearchParams({itemId: data.id}).toString()}`}>
            <img src={`${base64ImageEntry} ${data.imageBase64}`} alt='T-Shirt Image' />
            <div className='bottom-left'>
                <p className='name'>Name: {data.name}</p>
                <p className='sizes'>Sizes: {getSizesList(data.sizes)}</p>
            </div>
            <p className='price'>${data.price}</p>
        </a>
    )
}

const currentPage = Number(new URLSearchParams(window.location.search).get('page')) ?? 0;
const limit = 15; // same on backend
const shiftPage = shift => window.location.href=`/offers/index.html?${new URLSearchParams({page: currentPage + shift}).toString()}`;

const ItemCardsContainer = ({items, itemsCount}) => {
    return (
        <>
            <div className="item-cards-container">
                {
                items.map((item, i) => <ItemCard data={item} key={i} />)
                }
            </div>
            <nav id='item-navigation-buttons'>
                <button onClick={() => shiftPage(-1)} disabled={currentPage <= 0}>Previous Page</button>
                <p>{currentPage || 0}</p>
                <button onClick={() => shiftPage(1)} disabled={(currentPage * limit + limit) > itemsCount}>Next Page</button>
            </nav>
        </>
    )
}

const clearFilters = () => {
    sessionStorage.removeItem('filter-size-XS')
    sessionStorage.removeItem('filter-size-S')
    sessionStorage.removeItem('filter-size-L')
    sessionStorage.removeItem('filter-size-XL')
    sessionStorage.removeItem('filter-size-XXL')
    sessionStorage.removeItem('filter-size-XXXL')
    sessionStorage.removeItem('filter-price-min')
    sessionStorage.removeItem('filter-price-max')
}

const App = () => {
    const [items, setItems] = React.useState([]);
    const [itemsCount, setItemsCount] = React.useState(0);
    const [filterCount, setFilterCount] = React.useState(0);

    const [filters, setFilters] = React.useState({
        sizes: {
            XS: sessionStorage.getItem('filter-size-XS') === 'true',
            S: sessionStorage.getItem('filter-size-S')  === 'true',
            L: sessionStorage.getItem('filter-size-L')  === 'true',
            XL: sessionStorage.getItem('filter-size-XL')  === 'true',
            XXL: sessionStorage.getItem('filter-size-XXL')  === 'true',
            XXXL: sessionStorage.getItem('filter-size-XXXL')  === 'true',
        },
        price: {
            min: Number(sessionStorage.getItem('filter-price-min')) || 0,
            max: Number(sessionStorage.getItem('filter-price-max')) || 0,
        }
    });

    React.useEffect(() => {
        const params = new URLSearchParams({page: currentPage});
        for (const [size, val] of Object.entries(filters.sizes)) params.append(`sizes${size}`, val);
        params.append('priceMin', filters.price.min);
        params.append('priceMax', filters.price.max);
        params.append('sort', sessionStorage.getItem('sort') ?? '');
        fetch(`${backendHost}/api/items?${params.toString()}`)
        .then(res => res.json())
        .then(d => {
            setItems(d.items);
            setItemsCount(d.itemsCount)
        });
    }, [])

    React.useEffect(() => {
        let count = 0;
        [
            Object.entries(filters.sizes).some(([key, value]) => value === true),
            Object.entries(filters.price).some(([key, value]) => value !== 0)
        ].map(c => c && count++);
        setFilterCount(count)
    }, [filters])

    return (
        <>
            {items.length > 0 
                ? 
                <>
                    <h1>--- Fire T-Shirts offers! ---</h1>
                    <FiltersAndSorts filters={filters} setFilters={setFilters} filterCount={filterCount} setFilterCount={setFilterCount} />
                    <ItemCardsContainer items={items} itemsCount={itemsCount} />
                </>
                : 
                <div id='centered'>
                    <h1 id='no-items-msg'>There are no items!</h1>
                    <a id='no-items-page-href' href='/offers/index.html'>Back to main page</a>
                    {filterCount !== 0 && <a id='clear-filters-href' onClick={clearFilters} href="/offers/index.html">or clear filters</a> }
                </div>
            }
        </>
    )
}
const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)