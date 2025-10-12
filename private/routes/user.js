const express = require('express');
const router = express.Router();

const { UserRole, deleteUserById, createUser, getUserByToken, tryUserLogin, createSession, cookieToken, getUserById, updateUser, updateUserPassword } = require('../models/user');
const { createUserLocation } = require('../models/location');

router.get('/', async (req, res) => {
  try {
    const user = await getUserByToken(req.cookies.token)
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
    const user = await tryUserLogin(req);
    if (user == undefined) res.sendStatus(401).json({ error: "Invalid credentials" });
    else {
        const token = await createSession(user.id);
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
    const user = await getUserByToken(req.cookies.token);
    if (user.password !== req.body.oldPassword) return res.status(401).send('Old password is wrong');
    if (user.password === req.body.newPassword) return res.status(401).send("New password can not be the same");
    await updateUserPassword(user.id, req.body.newPassword)
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const currentUser = await getUserByToken(req.cookies.token);
    if (currentUser.role !== UserRole.MODERATOR) return res.sendStatus(401);
    const findUser = await getUserById(req.params.id);
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
    const currentUser = await getUserByToken(req.cookies.token);
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
    const currentUser = await getUserByToken(req.cookies.token);
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
    const user = getUserByToken(req.cookies.token)
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
    const user = await createUser(req);
    const token = await createSession(user.id);
    cookieToken(res, token);
    await createUserLocation(user.id);
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
})

module.exports = router;