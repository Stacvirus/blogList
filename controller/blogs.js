const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const {info, error} = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
            info('get complete successfully')
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    blog.save()
        .then(result => {
            response.status(201).json(result)
            info('post complete successfully')
        })
        .catch(err => error(err.message))
})

module.exports = blogsRouter