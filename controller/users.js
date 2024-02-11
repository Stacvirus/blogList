const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body;
    console.log('fuck is good');
    if (!username || !password || username.length < 3 || password.length < 3) {
        console.log(req.body);
        return res.status(400).json({ error: "username or password malformed" });
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const userObject = new User({
        username,
        name,
        passwordHash
    })
    try {
        const result = await userObject.save();
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/', async (req, res) => {
    try {
        const result = await User.find({}).populate('blogs', { title: 1, likes: 1 });
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }

});

module.exports = usersRouter;