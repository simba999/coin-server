import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';

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
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                name: 'New Company',
                incDate: '2016/08/29',
                funding: 'Not Raised Any Money',
                website: 'http://ishu.com',
                currency: 'USD',
                country: 'United State',
                state: 'New York'
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: 'Security 1',
                authorized: 21,
                liquidation: 'liquidation 1',
                accountId: account.uuid
            })
            .expect(200);

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Shareholder 1',
                type: 'individual',
                invitedEmail: 'shareholder@yopmail.com',
                address: 'new york, united state'
            })
            .expect(200);

        const {body} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                name: 'New Company',
                incDate: '2016/08/29',
                funding: 'Not Raised Any Money',
                website: 'http://ishu.com',
                currency: 'USD',
                country: 'United State',
                state: 'New York'
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: 'Security 1',
                authorized: 21,
                liquidation: 'liquidation 1',
                accountId: account.uuid
            })
            .expect(200);

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Shareholder 1',
                type: 'individual',
                invitedEmail: 'shareholder@yopmail.com',
                address: 'new york, united state'
            })
            .expect(200);

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
                securityId: security.uuid,
                shareholderId: shareholder.uuid
            })
            .expect(200);

        const {body} = await request(app)
            .put('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                securityTransactionId: securityTransaction.uuid,
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                name: 'New Company',
                incDate: '2016/08/29',
                funding: 'Not Raised Any Money',
                website: 'http://ishu.com',
                currency: 'USD',
                country: 'United State',
                state: 'New York'
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: 'Security 1',
                authorized: 21,
                liquidation: 'liquidation 1',
                accountId: account.uuid
            })
            .expect(200);

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Shareholder 1',
                type: 'individual',
                invitedEmail: 'shareholder@yopmail.com',
                address: 'new york, united state'
            })
            .expect(200);

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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
                name: 'New Company',
                incDate: '2016/08/29',
                funding: 'Not Raised Any Money',
                website: 'http://ishu.com',
                currency: 'USD',
                country: 'United State',
                state: 'New York'
            })
            .expect(200);

        const {body: {data: { security }}} = await request(app)
            .post('/v1/security')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                type: 'preferred_stock',
                name: 'Security 1',
                authorized: 21,
                liquidation: 'liquidation 1',
                accountId: account.uuid
            })
            .expect(200);

        const {body: {data: { shareholder }}} = await request(app)
            .post('/v1/shareholder')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Shareholder 1',
                type: 'individual',
                invitedEmail: 'shareholder@yopmail.com',
                address: 'new york, united state'
            })
            .expect(200);

        const {body: {data: { securityTransaction }}} = await request(app)
            .post('/v1/security-transaction')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                status: false,
                shares: 234.5,
                price: 10.5,
                restricted: false,
                restrictedUntil: '2018/09/25',
                issueDate: '2018/08/01',
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