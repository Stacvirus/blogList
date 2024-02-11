const supertest = require('supertest');
const Blog = require('../models/blog');
const app = require('../app');
const api = supertest(app);
const url = '/api/blogs';
const login = '/api/login'
const helper = require('./helper');
let token = null;

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObject = helper.initBlogs.map(blog => new Blog(blog));
    await Blog.insertMany(blogObject);
    const userLogin = { username: 'root', password: 'stacvirus' };
    const userLoged = await api.post(login).send(userLogin)
    expect(201);

    token = userLoged.text.split(':')[1].split(',')[0].replace('""', '');
    token = token.split('"')[1];

}, 100000);

describe('at the init stage', () => {
    test('the number of blog is', async () => {
        const blogs = await helper.getAllBlogs();
        expect(blogs).toHaveLength(helper.initBlogs.length);
    });
    test('verifying the existence of the id identifier', async () => {
        const res = await helper.getAllBlogs();
        expect(res[0]).toBeDefined();
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
        await api.post(url).set('Authorization', `Bearer ${token}`).send(newObject)
            .expect(201);

        const res = await helper.getAllBlogs();
        const contents = res.map(r => r.title);
        expect(contents).toContain('Binary Search Tree');
        expect(contents).toHaveLength(helper.initBlogs.length + 1);
    });

});

describe('verifying blog properties', () => {
    test('default the likes property to 0 if ommited', async () => {
        const newObject = {
            title: "Binary Search Tree",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        }
        await api.post(url).set('Authorization', `Bearer ${token}`).send(newObject);
        expect(201)
        const res = await helper.getAllBlogs();
        expect(0).toBe(res[res.length - 1].likes);
    });

    test('if blog title ommited status 400', async () => {
        const newObject = {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        };
        await api.post(url).set('Authorization', `Bearer ${token}`).send(newObject)
            .expect(400)

        const res = await helper.getAllBlogs();
        expect(res).toHaveLength(helper.initBlogs.length);
    });

    test('confirm the deletion of a blog', async () => {
        const newObject = {
            title: "Binary Search Tree",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        };
        const newBlob = await api.post(url).set('Authorization', `Bearer ${token}`).send(newObject);
        await api.delete(`${url}/${newBlob._body.id}`).set('Authorization', `Bearer ${token}`)
            .expect(204);
        const res = await helper.getAllBlogs();
        expect(res).toHaveLength(helper.initBlogs.length);
    });

    test('update a blog', async () => {
        const blogs = await helper.getAllBlogs();
        const id = blogs[1].id;
        const updatedBlog = await api.put(`${url}/${id}`).set('Authorization', `Bearer ${token}`).send({ likes: 13 });
        expect(updatedBlog._body.likes).toBe(13);
    }, 100000);

    test('if token omitted status 401', async () => {
        const newBlog = helper.initBlogs[0];
        const blogs = helper.getAllBlogs();

        await api.post(url).send(newBlog)
            .expect(401);
    });
});

