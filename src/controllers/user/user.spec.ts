import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import { User } from '../../models/user';
import { seedDatabase } from '../../tests/test.service';

const PASSWORD = 'Password1#';

describe(`POST /signup`, () => {
    beforeEach(async () => {
        await seedDatabase();
    });

    it(`should return 201 Created' on signup`, () => {
        return request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'test@email.com',
                phone: '89092345675',
                password: PASSWORD
            })
            .expect(201);
    });

    it(`should return 400 OK if user with such email already exists`, async () => {
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: PASSWORD
            })
            .expect(201);

        const {body} = await request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: PASSWORD
            })
            .expect(400);

        should(body).have.property('error', 'Bad Request');
        should(body).have.property('message', 'User with such email already exists!');
    });

    it(`should return token on login`, async () => {
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: PASSWORD
            })
            .expect(201);

        await request(app)
            .post('/v1/login')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .expect(200);
    });

    it(`should return current authenticated user`, async () => {
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: PASSWORD
            })
            .expect(201);

        const {body: {accessToken}} = await request(app)
            .post('/v1/login')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .expect(200);

        const {body} = await request(app)
            .get('/v1/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should.exist(body.user);
    });

    it('should patch password for authenticated user', async () => {

    });
});