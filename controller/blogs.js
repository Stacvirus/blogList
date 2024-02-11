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

blogsRouter.post('/', async (request, response, next) => {
    const object = request.body;
    const user = request.user;

    if (!object.likes) object.likes = 0;
    if (!object.title) return response.status(400).end();

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

blogsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Blog.findByIdAndDelete(id);
        res.status(204).end();
        info('deletion complete successfully');
    } catch (err) {
        next(err);
    }
});

blogsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    let element = await Blog.findById(id);
    element = { ...element._doc, likes: req.body.likes };
    try {
        const final = await Blog.findByIdAndUpdate(id, element, { new: true });
        res.json(final);
        info('update blog successful');
    } catch (err) {
        next(err)
    }
});

module.exports = blogsRouter;