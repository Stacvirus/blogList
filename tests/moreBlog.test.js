const supertest = require('supertest');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const url = '/Blog/publications';

const initBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObject = initBlogs.map(blog => new Blog(blog));
    await Blog.insertMany(blogObject);
}, 100000);

describe('at the init stage', () => {
    test('the number of blog is', async () => {
        const blogs = await api.get(url);
        expect(blogs.body).toHaveLength(initBlogs.length);
    });
    test('verifying the existence of the id identifier', async () => {
        const res = await api.get(url);
        expect(res.body[0]).toBeDefined();
    });
});

describe('itermediate stage in DB', () => {
    test('verify that a publication have been posted successfully', async () => {
        const newObject = {
            title: "Binary Search Tree",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 22,
        }
        await api.post(url).send(newObject);
        const res = await api.get(url);
        const contents = res.body.map(r => r.title);
        expect(contents).toContain('Binary Search Tree');
        expect(contents).toHaveLength(initBlogs.length + 1);
    });

});

describe('verifying blog properties', () => {
    test('default the likes property to 0 if ommited', async () => {
        const newObject = {
            title: "Binary Search Tree",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        };
        await api.post(url).send(newObject);
        const res = await api.get(url);
        const contents = res.body.map(r => r);
        expect(0).toBe(contents[contents.length - 1].likes);
    });

    test('if blog title ommited status 400', async () => {
        const newObject = {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        };
        await api.post(url).send(newObject)
            .expect(400)
        const res = await api.get(url);
        expect(res.body).toHaveLength(initBlogs.length);
    });
});