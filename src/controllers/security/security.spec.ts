import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import faker from 'faker';

const PASSWORD = 'Password2#';
const EMAIL = 'duplicate@email.com';

describe(`POST /security`, () => {

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
            .post('/v1/security')
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: '5172e1e8-7c0e-47ee-9fe1-082c619de99f'
            })
            .expect(401);
    });

    it(`should return 200 OK if security created`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        const {body} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('PUT /security', () => {

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
            .put('/v1/security')
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: '5172e1e8-7c0e-47ee-9fe1-082c619de99f'
            })
            .expect(401);
    });

    it (`should return 422 BadData if account does not exists for security`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                securityId: security.uuid,
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: '5172e1e8-7c0e-47ee-9fe1-082c619de99f'
            })
            .expect(422);

        should(body).have.property('message', 'Account not found');
    });

    it(`should return 200 OK if security created`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                securityId: security.uuid,
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('GET /security/{uuid}', () => {

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
            .get('/v1/security/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if get security info`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .get(`/v1/security/${security.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('DELETE /security/{uuid}', () => {

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
            .delete('/v1/security/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if delete security`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .delete(`/v1/security/${security.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('GET /security/list/{uuid}', () => {

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
            .get('/v1/security/list/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if get security list`, async () => {

        const {body: {data: { account }}} = await request(app)
            .post('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(200);

        await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: faker.commerce.department(),
                authorized: faker.finance.amount(0.1, 100),
                liquidation: faker.finance.accountName(),
                accountId: account.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .get(`/v1/security/list/${account.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});