const express = require('express');
const router = express.Router();

const User = require('../models/user');
const { createUserLocation } = require('../models/location');

// Writes a token into a cookie.
// 60 days token storage
const cookieToken = (res, token) => {
    res.cookie("token", token, {
        // sameSite: "none",
        // secure: false,
        maxAge: 24*60*60*60*1000
    });
}

router.get('/', async (req, res) => {
  try {
    const user = await User.getByToken(req.cookies.token)
    if (user == undefined) res.sendStatus(401)
    const { id, first_name, last_name, email, role } = user;
    res.json({
      firstName: first_name,
      lastName: last_name,
      email: email,
      role: role,
      id: id,
    });
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.get('/by-login', async (req, res) => {
  try {
    const user = await User.tryLogin(req);
    if (user == undefined) res.sendStatus(401).json({ error: "Invalid credentials" });
    else {
        const token = await User.createSession(user.id);
        cookieToken(res, token)
        res.sendStatus(200);
    }
  } catch(err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.put('/password', async (req, res) => {
  try {
    const user = await User.getByToken(req.cookies.token);
    if (user.password !== req.body.oldPassword) return res.status(401).send('Old password is wrong');
    if (user.password === req.body.newPassword) return res.status(401).send("New password can not be the same");
    await User.updatePassword(user.id, req.body.newPassword)
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const currentUser = await User.getByToken(req.cookies.token);
    if (currentUser.role !== UserRole.MODERATOR) return res.sendStatus(401);
    const findUser = await User.getById(req.params.id);
    if (findUser.id === currentUser.id) res.sendStatus(401);
    const { id, first_name, last_name, email, role } = findUser;
    res.json({
      firstName: first_name,
      lastName: last_name,
      email: email,
      role: role,
      id: id,
    });
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const currentUser = await User.getByToken(req.cookies.token);
    if (currentUser.role !== UserRole.MODERATOR) return res.sendStatus(401);
    await updateUser(req);
    res.sendStatus(200);
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.delete('/:id', async(req, res) => {
  try {
    const currentUser = await User.getByToken(req.cookies.token);
    if (currentUser.role !== UserRole.MODERATOR) return res.sendStatus(401);
    await deleteUserById(req.params.id)
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.delete('/', async(req, res) => {
  try {
    const user = User.getByToken(req.cookies.token)
    await deleteUserById(user.id)
    res.clearCookie('token');
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('token');
    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = await User.createSession(user.id);
    cookieToken(res, token);
    await createUserLocation(user.id);
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
})

module.exports = router;