import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import faker from 'faker';

const PASSWORD = 'Password1#';

describe(`POST /signup`, () => {

    it(`should return 200 Created' on signup`, () => {
        return request(app)
            .post('/v1/signup')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.random.word() + '@yopmail.com',
                password: PASSWORD
            })
            .expect(200);
    });

    it(`should return 400 OK if user with such email already exists`, async () => {
        const email = faker.random.word() + '@yopmail.com';
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: email,
                password: PASSWORD
            })
            .expect(200);

        const {body} = await request(app)
            .post('/v1/signup')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: email,
                password: PASSWORD
            })
            .expect(400);

        should(body).have.property('error', 'Bad Request');
        should(body).have.property('message', 'User with such email already exists!');
    });
});

describe('POST /signin', () => {

    it(`should return token on login`, async () => {
        const email = faker.random.word() + '@yopmail.com';
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: email,
                password: PASSWORD
            })
            .expect(200);

        const {body: { data: {accessToken}}} = await request(app)
            .post('/v1/signin')
            .send({
                email: email,
                password: PASSWORD
            })
            .expect(200);

        should.exist(accessToken);
    });
});

describe( 'PUT /user/password', () => {

    it('should update password for authenticated user', async () => {
        const email = faker.random.word() + '@yopmail.com';
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: email,
                password: PASSWORD
            })
            .expect(200);

        const {body: { data: {accessToken}}} = await request(app)
            .post('/v1/signin')
            .send({
                email: email,
                password: PASSWORD
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/user/password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                password: 'Password2#',
                currentPassword: PASSWORD
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});