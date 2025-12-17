const crypto = require('crypto');
const app = require('./app');
const { query } = require('./dbmodel');
const request = require('supertest');

const rnd = () => crypto.randomBytes(12).toString('hex')
const createUser = async () => {
    const firstName = rnd();
    const lastName = rnd();
    const email = `${rnd()}@${rnd()}`;
    const password = rnd();
    const res = await query(
        `INSERT INTO users(first_name, last_name, email, password) 
        VALUES($1, $2, $3, $4) 
        RETURNING *`,
        [firstName, lastName, email, password]
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
    })
})