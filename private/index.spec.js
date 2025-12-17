const api = 'http://localhost:3000/api/';
const crypto = require('crypto');
const app = require('./app');
const { query } = require('./dbmodel');
const request = require('supertest');

// jest.useFakeTimers();

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
    afterEach(async () => {
        await query('TRUNCATE TABLE cart, item_sizes, items, locations, order_items, orders, sessions, users CASCADE;');
    })
    describe('user', () => {
        const fn = () => it('POST /', async () => {
            // const {res} = await createUser();
            // expect(res.ok).toBe(true);
            await request(app)
            .post('/api/user')
            .send({
                firstName: '123',
                lastName: '123',
                email: '123@123',
                password: '123'
            })
            .set('Content-Type', 'application/json')
            .expect(200);
        })
        for(let i = 0; i < 100; i++) fn();
    })
})