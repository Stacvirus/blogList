const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./helper');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const userUrl = '/api/users'

describe('users admin stage where there is one user', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('stacvirus', 10);
        const user = new User({ username: 'root', name: 'superuser', passwordHash });

        await user.save();
    });

    test('successful creation of new users', async () => {
        const userAtStart = helper.getAllUsers();

        const newUser = {
            username: 'stac',
            name: 'virus',
            password: 'fuckisgood',
        }

        await api.post(userUrl).send(newUser)
            .expect('Content-Type', /application\/json/)
            .expect(201)
        const userAtEnd = await helper.getAllUsers();
        console.log(userAtEnd.length);
        expect(userAtEnd).toHaveLength(userAtStart.length + 1);
    });

    test('invlid users are not created', async () => {
        const newUser = {
            username: 'am',
            name: 'satcha',
            password: 'fuckisgood'
        }
        const result = await api.post(userUrl).send(newUser)
            .expect(400)
        console.log(result.text);
        expect(result.text).toContain('username or password malformed');
    });
});