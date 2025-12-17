const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    await user.createSession(res);
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
})

router.get('/', async (req, res) => {
  try {
    const user = await User.fromToken(req.cookies.token)
    if (user == undefined) res.sendStatus(401)
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      id: user.id,
    });
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.fromLogin(req.body);
    if (user == undefined) return res.sendStatus(401).json({ error: "Invalid credentials" });
    await user.createSession(res);
    res.sendStatus(200);
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.put('/password', async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;
    const user = await User.fromToken(req.cookies.token);
    if (user.password !== oldPassword) return res.status(401).send('Old password is wrong');
    if (user.password === newPassword) return res.status(401).send("New password can not be the same");
    await user.updatePassword(newPassword);
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

// Temporary solution
router.delete('/', async(req, res) => {
  try {
    const user = await User.fromToken(req.cookies.token);
    await user.delete()
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

// MODERATORS ONLY
const isModerator = async token => {
  const expectedModerator = await User.fromToken(token);
  return expectedModerator.role === User.Role.MODERATOR;
}

router.get('/:id', async (req, res) => {
  try {
    const currentUser = await User.getByToken(req.cookies.token);
    const isMod = await isModerator(req.cookies.token);
    if (!isMod) return res.sendStatus(401);
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
    const isMod = await isModerator(req.cookies.token);
    if (!isMod) return res.sendStatus(401);
    const user = User.fromId(req.params.id);
    await user.setRole(req.body.role);
    res.sendStatus(200);
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.delete('/:id', async(req, res) => {
  try {
    const isMod = await isModerator(req.cookies.token);
    if (!isMod) return res.sendStatus(401);
    const user = User.fromId(req.params.id); // User for deletion
    await user.delete();
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})


module.exports = router;