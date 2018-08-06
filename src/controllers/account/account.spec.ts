import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';
import faker from 'faker';

const PASSWORD = 'Password2#';
const EMAIL = 'duplicate@email.com';

describe(`POST /account`, () => {

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
            .post('/v1/account')
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
            .expect(401);
    });

    it(`should return 200 OK if account created`, async () => {

        const {body} = await request(app)
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

        should(body).have.property('status', 'success');
    });
});

describe('PUT /account', () => {

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
            .put('/v1/account')
            .send({
                accountId: '',
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(401);
    });

    it (`should return 422 BadData if not exists`, async () => {

        const {body} = await request(app)
            .put('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                accountId: 'c53e7be6-9ccb-41c9-bf1b-1a387e97fc72',
                type: 'company',
                name: faker.company.companyName(),
                incDate: faker.date.future(),
                funding: 'Not Raised Any Money',
                website: faker.internet.domainName(),
                currency: faker.finance.currencyCode(),
                country: faker.address.country(),
                state: faker.address.state()
            })
            .expect(422);

        should(body).have.property('message', 'Account not found');
    });

    it(`should return 200 OK if account updated`, async () => {

        const {body: {data: {account: account}}} = await request(app)
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
            .put('/v1/account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                accountId: account.uuid,
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

        should(body).have.property('status', 'success');
    });
});

describe('GET /account/{uuid}', () => {

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
            .get('/v1/account/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if get account info`, async () => {

        const {body: {data: {account: account}}} = await request(app)
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
            .get(`/v1/account/${account.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});

describe('DELETE /account/{uuid}', () => {

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
            .delete('/v1/account/c53e7be6-9ccb-41c9-bf1b-1a387e97fc7d')
            .expect(401);
    });

    it (`should return 200 OK if delete account`, async () => {

        const {body: {data: {account: account}}} = await request(app)
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
            .delete(`/v1/account/${account.uuid}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        should(body).have.property('status', 'success');
    });
});