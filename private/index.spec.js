const api = 'http://localhost:3000/api/';
const crypto = require('crypto');

const app = require('./app');
const { query } = require('./dbmodel');

jest.useFakeTimers();

const rnd = () => crypto.randomBytes(12).toString('hex')
const createUser = async () => {
    const firstName = rnd();
    const lastName = rnd();
    const email = `rnd()@${rnd()}`;
    const password = rnd();
    const res = await fetch(`${api}user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
        }),
    })
    const cookie = res.headers.get('set-cookie')
    return {
        res,
        firstName,
        lastName,
        email,
        password,
        cookie
    };
}

describe('app', () => {
    afterAll(() => {
        query('TRUNCATE TABLE cart, item_sizes, items, locations, order_items, orders, sessions, users CASCADE;');
    })
    describe('user', () => {
        it('POST /', async () => {
            const {res} = await createUser();
            expect(res.ok).toBe(true);
        })
        it('GET /', async () => {
            const user = await createUser();
            const res = await fetch(`${api}user`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cookie': user.cookie,
                }
            })
            expect(res.ok).toBe(true);
        })
        it('GET /by-login', async () => {
            const user = await createUser();
            const params = new URLSearchParams({
                email: user.email,
                password: user.password
            })
            const res = await fetch(`${api}user/by-login?${params.toString()}`)
            expect(res.ok).toBe(true);
        })
        it('PUT /password', async () => {
            const user = await createUser();
            const res = await fetch(`${api}user/password`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Cookie': user.cookie,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: user.password,
                    newPassword: rnd(),
                })
            })
            expect(res.ok).toBe(true);
        })
        it('POST /logout', async () => {
            const user = await createUser();
            const res = await fetch(`${api}user/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Cookie': user.cookie,
                }
            })
            expect(res.ok).toBe(true);
        })
    })
    describe('location', () => {
        let user;
        beforeAll(async () => user = await createUser());
        it('POST /', async () => {
            const res = await fetch(`${api}location`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': user.cookie,
                },
                body: JSON.stringify({
                    street: 'street',
                    place: 'place',
                    psc: 'psc',
                })
            })
            expect(res.ok).toBe(true);
        })
        it('GET /:id', async () => {
            const res = await fetch(`${api}location`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cookie': user.cookie,
                },
            });
            expect(res.ok).toBe(true);
        })
    })
    describe('items', () => {
        it('GET /', async () => {
            const params = new URLSearchParams({
                page: 0,
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
            const res = await fetch(`${api}items?${params.toString()}`);
            expect(res.ok).toBe(true);
        })
        it('GET /:id', async () => {
            const res = await fetch(`${api}items/58`);
            expect(res.ok).toBe(true);
        })
    })
})