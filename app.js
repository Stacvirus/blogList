const express = require('express');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const { info, error } = require("./utils/logger");
const { MONGODB_URI } = require('./utils/config');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controller/blogs');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');

info('connecting ...', MONGODB_URI)
mongoose.connect(MONGODB_URI)
    .then(res => info("connected to MongoDB"))
    .catch((err) => error(err.message))

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.getTokenFrom);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use("/api/blogs", blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknwonEndpoint);
app.use(middleware.erroHandler);

module.exports = app;