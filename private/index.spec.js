const path = 'http://localhost:3000/api/';

describe('app', () => {
    it('/items/', async () => {
        const params = new URLSearchParams({
            page:0,
            sizesXS: 'true',
            sizesS: 'true',
            sizesL: 'true',
            sizesXL: 'true',
            sizesXXL: 'true',
            sizesXXXL: 'true',
            priceMin: '0',
            priceMax: '9999999',
            sort: ''
        })
        const res = await fetch(`${path}items?${params.toString()}`);
        expect(res.ok).toBe(true);
    })
    it('/items/:id', async () => {
        const res = await fetch(`${path}items/58`);
        expect(res.ok).toBe(true);
    })
})