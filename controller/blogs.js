const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { info, error } = require('../utils/logger');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
    info('get complete successfully');
});

blogsRouter.post('/', async (request, response) => {
    const object = request.body;
    if (!object.likes) object.likes = 0;
    if (!object.title) return response.status(400).end();
    const blog = new Blog(object);
    try {
        const result = await blog.save();
        response.status(201).json(result);
        info('post complete successfully');
    }
    catch (err) {
        error(err.message);
    }
});

module.exports = blogsRouter;