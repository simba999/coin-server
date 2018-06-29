import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/user';

const chai = require('chai');
const expect = chai.expect;

describe(`POST /signup`, () => {
    beforeAll(async () => {
        await User.destroy({
            where: {email: ['test@email.com', 'duplicate@email.com']},
            force: true,
        });

    });

    it(`should return 201 Created' on signup`, () => {
        return request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'test@email.com',
                phone: '89092345675',
                password: 'password1'
            })
            .expect(201);
    });

    it(`should return 400 OK if user with such email already exists`, async (done) => {
        await request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: 'password1'
            })
            .expect(201);

        request(app)
            .post('/v1/signup')
            .send({
                firstName: 'test',
                lastName: 'test',
                email: 'duplicate@email.com',
                phone: '89092345675',
                password: 'password1'
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal('Bad Request');
                expect(res.body.message).to.equal('User with such email already exists!');
                done();
            });
    });
});
