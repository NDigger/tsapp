const crypto = require('crypto');
const app = require('./app');
const { query } = require('./dbmodel');
const request = require('supertest');

const fs = require('fs');
const User = require('./models/user');

const randomBytes = length => crypto.randomBytes(length).toString('hex')
const createUser = async (role = User.Role.PURCHASER) => {
    const firstName = randomBytes(6);
    const lastName = randomBytes(6);
    const email = `${randomBytes(9)}@${randomBytes(6)}`;
    const password = randomBytes(12);
    const res = await query(
        `INSERT INTO users(first_name, last_name, email, password, role) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING *`,
        [firstName, lastName, email, password, role]
    )
    const user = res.rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    await query('INSERT INTO sessions(user_id, token) VALUES($1,$2)', [user.id, token])
    return {
        ...user,
        token
    };
}

describe('app', () => {
    afterEach(async () => await query(`
        TRUNCATE TABLE cart, item_sizes, items, locations, order_items, orders, sessions, users CASCADE
    `))
    describe('user', () => {
        it('POST /', async () => {
            await request(app)
            .post('/api/user')
            .send({
                firstName: 'example',
                lastName: 'example',
                email: 'example@mail',
                password: '1234'
            })
            .set('Content-Type', 'application/json')
            .expect(200);
        })
        it('GET /', async () => {
            const user = await createUser();
            await request(app)
            .get('/api/user')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
        it('POST /login', async () => {
            const user = await createUser();
            await request(app)
            .post('/api/user/login')
            .send({
                email: user.email,
                password: user.password,
            })
            .set('Content-Type', 'application/json')
            .expect(200)
        })
        it('PUT /password', async () => {
            const user = await createUser();
            await request(app)
            .put('/api/user/password')
            .send({
                oldPassword: user.password,
                newPassword: 'newPassword123@',
            })
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
        it('GET /:id', async () => {
            const user = await createUser();
            const mod = await createUser(User.Role.MODERATOR);
            await request(app)
            .get(`/api/user/${user.id}`)
            .set('Cookie', `token=${mod.token}`)
            .expect(200)
        })
        it('DELETE /', async () => {
            const user = await createUser();
            await request(app)
            .delete(`/api/user`)
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
        it('PUT /:id', async () => {
            const user = await createUser();
            const mod = await createUser(User.Role.MODERATOR);
            await request(app)
            .put(`/api/user/${user.id}`)
            .send({
                role: User.Role.PURCHASER,
            })
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${mod.token}`)
            .expect(200)
        })
        it('DELETE /:id', async () => {
            const user = await createUser();
            const mod = await createUser(User.Role.MODERATOR);
            await request(app)
            .delete(`/api/user/${user.id}`)
            .set('Cookie', `token=${mod.token}`)
            .expect(200)
        })
    })
    describe('location', () => {
        it('POST /', async () => {
            const user = await createUser();
            await request(app)
            .post('/api/location')
            .send({
                street: 'street',
                place: 'place',
                psc: '123456',
            })
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
        it('GET /', async () => {
            const user = await createUser();
            await query(
                'INSERT INTO locations(user_id, street, place, psc) VALUES($1, $2, $3, $4)', 
                [user.id, 'street', 'place', '123456']
            )
            await request(app)
            .get('/api/location')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
    })
    describe('items', () => {
        it('POST /', async () => {
            const user = await createUser(User.Role.SELLER);
            const buffer = await new Promise((resolve, reject) => {
                fs.readFile('./testImage.jpg', (err, data) => {
                    err ? reject(err) : resolve(data)
                })
            })
            const image = new File([buffer], 'image.jpg', { 
                type: 'image/jpeg',
                originalname: 'image.txt',
                fieldname: 'image.txt'
             })
            await request(app)
            .post('/api/items')
            .field('name', 'T-Shirt')
            .field('material', 'example')
            .field('price', '15')
            .field('sizes', JSON.stringify({ XL: '1', L: '2', S: '4' }))
            .attach('image', './testImage.jpg')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
    })
})