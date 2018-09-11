import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import faker from 'faker';

const PASSWORD = 'Password2#';
const EMAIL = 'duplicate@email.com';

describe(`POST /security-transaction`, () => {

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
            .post('/v1/security-transaction')
            .send({
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: '26716619-b2a2-4f41-a7b3-e80110292c3d',
                shareholderId: '6f93c9d4-51a0-497d-9f71-a07961d78e97'
            })
            .expect(401);
    });

    it(`should return 200 OK if security transaction created`, async () => {

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
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('PUT /security-transaction', () => {

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
            .put('/v1/security-transaction')
            .send({
                securityTransactionId: '2218f615-975b-463c-a6db-85ef8e6464d0',
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: '26716619-b2a2-4f41-a7b3-e80110292c3d',
                shareholderId: '6f93c9d4-51a0-497d-9f71-a07961d78e97'
            })
            .expect(401);
    });

    it (`should return 422 BadData if security transaction does not exists for security`, async () => {

        const { body } = await request(app)
            .put('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                securityTransactionId: '2218f615-975b-463c-a6db-85ef8e6464dd',
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: '26716619-b2a2-4f41-a7b3-e80110292c3d',
                shareholderId: '6f93c9d4-51a0-497d-9f71-a07961d78e97'
            })
            .expect(422);

        should(body).have.property('message', 'SecurityTransaction not found');
    });

    it(`should return 200 OK if security transaction updated`, async () => {

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

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                securityTransactionId: securityTransaction.uuid,
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('GET /security-transaction/{uuid}', () => {

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
            .get('/v1/security-transaction/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if get shareholder info`, async () => {

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

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .get(`/v1/security-transaction/${securityTransaction.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('DELETE /security-transaction/{uuid}', () => {

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
            .delete('/v1/security-transaction/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if delete shareholder`, async () => {

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

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: faker.random.boolean(),
                shares: faker.finance.amount(),
                price: faker.finance.amount(),
                restricted: faker.random.boolean(),
                restrictedUntil: faker.date.future(),
                issueDate: faker.date.past(),
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .delete(`/v1/security-transaction/${securityTransaction.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});