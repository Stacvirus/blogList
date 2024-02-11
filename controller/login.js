const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const pwdcorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && pwdcorrect)) {
        return res.status(401).json({ error: 'invalid username or password' });
    };

    const userToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userToken, process.env.SECRET);
    try {
        res.status(200)
            .send({ token, username: user.username, name: user.name });
    } catch (error) {
        next(error);
    }

});

module.exports = loginRouter;
