const { info, error } = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const erroHandler = (err, req, res, next) => {
    error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' });
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }

    next(err);
}

const unknwonEndpoint = (req, res) => {
    res.status(400).send({ error: 'unknown endpoint' });
}

const requestLogger = (req, res, next) => {
    info('Method:', req.method);
    info('Path:', req.path);
    info('Body:', req.body);
    info('---');
    next();
}

function getTokenFrom(req, res, next) {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    }
    next();
};

const userExtractor = async (req, res, next) => {
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(req.token, process.env.SECRET);
    } catch (error) {
        return next(error);
    }
    req.user = await User.findById(decodedToken.id);
    next();
}


module.exports = { erroHandler, unknwonEndpoint, requestLogger, getTokenFrom, userExtractor };