const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { info, error } = require('../utils/logger');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response, next) => {
    const user = request.user;
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
        response.json(blogs);
        info('get complete successfully');
    } catch (error) {
        next(error);
    }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const object = request.body;

    if (!object.likes) object.likes = 0;
    if (!object.title) return response.status(400).json({ error: 'title ommitted!' });

    const user = request.user;

    const blog = new Blog({
        title: object.title,
        author: object.author,
        url: object.url,
        likes: object.likes,
        user: user._id
    });

    try {
        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id);
        await user.save();

        response.status(201).json(result);
        info('post complete successfully');
    }
    catch (err) {
        next(err);
    }
});

blogsRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await Blog.findByIdAndDelete(id);
        res.status(204).end();
        info('deletion complete successfully');
    } catch (err) {
        next(err);
    }
});

blogsRouter.put('/', async (req, res, next) => {
    let blog = req.body;
    const id = blog.id;
    blog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
    }
    try {
        const final = await Blog.findByIdAndUpdate(id, blog, { new: true });
        res.json(final);
        info('update blog successful');
    } catch (err) {
        next(err)
    }
});

module.exports = blogsRouter;