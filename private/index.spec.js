const crypto = require('crypto');
const app = require('./app');
const { query } = require('./dbmodel');
const request = require('supertest');

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
    const controller = await User.fromToken(token);
    return {
        ...user,
        token,
        controller,
    };
}
const createItem = async (userId = undefined) => {
    if (userId === undefined) {
        user = await createUser(User.Role.SELLER);
        userId = user.id;
    }

    let item = await query(
        'INSERT INTO items(seller_id, name, image_path, material, price) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [userId, 'exampleItem', 'testImage.jpg', 'exampleMaterial', 15]
    );
    item = item.rows[0];
    const id = item.id;

    const sizedItems = [];

    const setSizedItem = async(itemId, size) => {
        const item = await query(
            'INSERT INTO item_sizes(item_id, name, quantity) VALUES($1, $2, $3) ON CONFLICT (item_id, name) DO UPDATE SET quantity=EXCLUDED.quantity RETURNING *',
            [id, size.name, size.quantity]
        );
        sizedItems.push(item.rows[0]);
    }
    await setSizedItem(id, {name: 'XS', quantity: 7})
    await setSizedItem(id, {name: 'S', quantity: 6})
    await setSizedItem(id, {name: 'L', quantity: 5})
    await setSizedItem(id, {name: 'XL', quantity: 4})
    await setSizedItem(id, {name: 'XXL', quantity: 3})
    await setSizedItem(id, {name: 'XXXL', quantity: 2})
    item.sizes = sizedItems;
    return item;
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

        // LETS CHECK FOR ERRORS
        it('ERROR POST /', async () => {
            await request(app)
            .post('/api/user')
            .send({
                firstName: 'example',
                lastName: 'example',
                email: 'examplemail', // Email must contain @ symbol
                password: '1234'
            })
            .set('Content-Type', 'application/json')
            .expect(500);
        })
        it('ERROR PUT /:id', async () => {
            const user = await createUser();
            const notMod = await createUser(); // Not mod is trying to change another user role
            await request(app)
            .put(`/api/user/${user.id}`)
            .send({
                role: User.Role.PURCHASER,
            })
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${notMod.token}`)
            .expect(401)
        })
        it('ERROR DELETE /', async () => {
            // const user = await createUser();
            await request(app)
            .delete(`/api/user`)
            // Cookie is not set, app can't delete user
            // .set('Cookie', `token=${user.token}`)
            .expect(500)
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
        it('GET /', async () => {
            await createItem();
            const params = new URLSearchParams({
                sizeXS: 'true',
                sizeS: 'true',
                sizeL: 'true',
                sizeXL: 'true',
                sizeXXL: 'true',
                sizeXXXL: 'true',
                priceMin: 0,
                priceMax: 9999999,
                sort: ''
            })
            await request(app)
            .get(`/api/items?${params.toString()}`)
            .expect(200)
        })
        it('GET /:id', async () => {
            const item = await createItem();
            await request(app)
            .get(`/api/items/${item.id}`)
            .expect(200);
        })
    })
    describe('seller', () => {
        it('GET /items', async () => {
            const user = await createUser(User.Role.SELLER);
            await createItem(user.id);
            await request(app)
            .get('/api/seller/items')
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
        it('GET /item/:itemId', async () => {
            const user = await createUser(User.Role.SELLER);
            const item = await createItem(user.id);
            await request(app)
            .get(`/api/seller/item/${item.id}`)
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
        it('DELETE /item/:itemId', async () => {
            const user = await createUser(User.Role.SELLER);
            const item = await createItem(user.id);
            await request(app)
            .delete(`/api/seller/item/${item.id}`)
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
    })
    describe('cart', () => {
        it('POST /', async () => {
            const user = await createUser();
            const item = await createItem();
            await request(app)
            .post('/api/cart')
            .send({
                sizedItemId: item.sizes.find(size => size.name === 'XS').id,
                quantity: '1',
            })
            .set('Content-Type', 'application/json')
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
        it('GET /', async () => {
            const user = await createUser();
            const item = await createItem();
            const sizedItemId = item.sizes.find(size => size.name === 'XS').id;
            user.controller.addCartItem(sizedItemId, 1);
            await request(app)
            .get('/api/cart')
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
        it('DELETE /:id', async () => {
            const user = await createUser();
            const item = await createItem();
            const sizedItemId = item.sizes.find(size => size.name === 'XS').id;
            user.controller.addCartItem(sizedItemId, 1);
            await request(app)
            .delete(`/api/cart/${sizedItemId}`)
            .set('Cookie', `token=${user.token}`)
            .expect(200);
        })
    })
    describe('order', () => {
        it('POST /', async () => {
            const user = await createUser();
            const item = await createItem();
            const sizedItemId = item.sizes.find(size => size.name === 'XS').id;
            await user.controller.addCartItem(sizedItemId, 1);
            await request(app)
            .post('/api/order')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
        it('GET /', async () => {
            const user = await createUser();
            const item = await createItem();
            const sizedItemId = item.sizes.find(size => size.name === 'XS').id;
            await user.controller.addCartItem(sizedItemId, 1);
            await user.controller.pushOrder()
            await request(app)
            .get('/api/order')
            .set('Cookie', `token=${user.token}`)
            .expect(200)
        })
    })
})