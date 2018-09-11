import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import faker from 'faker';
import { string } from 'joi';
import { PASSWORD_REGEX } from '../../models/user';

const PASSWORD = 'Password2#';
const EMAIL = 'duplicate@email.com';

describe(`POST /shareholder`, () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 401 Unauthorized if not signin`, async () => {
        await request(app)
            .post('/v1/shareholder')
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(401);
    });

    it(`should return 200 OK if shareholder created`, async () => {

        const {body} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('PUT /shareholder', () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 401 Unauthorized if not signin`, async () => {
        await request(app)
            .put('/v1/shareholder')
            .send({
                shareholderId: 'dcfa41cc-ba5c-45c6-a196-0481376c3172',
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(401);
    });

    it (`should return 422 BadData if shareholder does not exists for security`, async () => {

        const { body } = await request(app)
            .put('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: 'dcfa41cc-ba5c-45c6-a196-0481376c3172',
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(422);

        should(body).have.property('message', 'Shareholder not found');
    });

    it(`should return 200 OK if shareholder updated`, async () => {

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: shareholder.uuid,
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('GET /shareholder/{uuid}', () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 401 Unauthorized if not signin`, async () => {
        await request(app)
            .get('/v1/shareholder/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if get shareholder info`, async () => {

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        const {body} = await request(app)
            .get(`/v1/shareholder/${shareholder.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('DELETE /shareholder/{uuid}', () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 401 Unauthorized if not signin`, async () => {
        await request(app)
            .delete('/v1/shareholder/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if delete shareholder`, async () => {

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        const {body} = await request(app)
            .delete(`/v1/shareholder/${shareholder.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('POST /shareholder/invite', () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 401 Unauthorized if not signin`, async () => {
        await request(app)
            .post('/v1/shareholder/invite')
            .send({
                shareholderId: 'c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d',
                invitedEmail: 'alex.vaitkus@ishu.io',
            })
            .expect(401);
    });

    it (`should return 422 BadData if shareholder was already invited`, async () => {
        const {body: {data: {shareholder}}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        await request(app)
            .post(`/v1/shareholder/invite`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: shareholder.uuid,
                invitedEmail: 'alex.vaitkus@ishu.io',
            })
            .expect(200);

        const {body} = await request(app)
            .post(`/v1/shareholder/invite`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: shareholder.uuid,
                invitedEmail: 'alex.vaitkus@ishu.io',
            })
            .expect(422);

        should(body).have.property('message', 'Shareholder is already invited to Ishu');
    });

    it (`should return 200 OK if invite shareholder`, async () => {

        const {body: {data: {shareholder}}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        const {body} = await request(app)
            .post(`/v1/shareholder/invite`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: shareholder.uuid,
                invitedEmail: 'alex.vaitkus@ishu.io',
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('POST /shareholder/invite-accept/{token}', () => {

    let accessToken: string;

    beforeEach((done) => {
        request(app)
            .post('/v1/signin')
            .send({
                email: 'duplicate@email.com',
                password: PASSWORD
            })
            .end((err, res) => {
                if (err) throw err;
                accessToken = res.body.data.accessToken;
                done();
            });
    });

    it (`should return 422 badData if token is incorrect`, async () => {
        const { body } = await request(app)
            .post('/v1/shareholder/invite-accept/unknown-token-6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e51')
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: 'Password#1',
            })
            .expect(422);

        should(body).have.property('message', 'Shareholder not found');
    });

    it (`should return 200 OK if accept invitation successfully`, async () => {

        const {body: {data: {shareholder}}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: faker.random.word(),
                type: 'individual',
                invitedEmail: faker.random.word() + '@yopmail.com',
                address: faker.address.secondaryAddress()
            })
            .expect(200);

        const {body: { data: { inviteToken } }} = await request(app)
            .post(`/v1/shareholder/invite`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                shareholderId: shareholder.uuid,
                invitedEmail: shareholder.invitedEmail,
            })
            .expect(200);

        const { body } = await request(app)
            .post(`/v1/shareholder/invite-accept/${inviteToken}`)
            .send({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: 'Password#1',
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});