import 'mocha';
import request from 'supertest';
import should from 'should';
import app from '../../app';

const PASSWORD = 'Password2#';
const EMAIL = 'duplicate@email.com';

describe(`POST /initialize`, () => {

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
            .post('/v1/initialize')
            .send({
                name: 'Company Name',
                incDate: '2018/08/01',
                website: 'https://localhost:5000',
                currency: 'EUR',
                country: 'US',
                state: 'STATE',
                funding: 'Not Raised Any Money',
                role: 'owner',
                securities: [
                    {
                        type: 'warrant',
                        name: 'Security name 1',
                        authorized: 12343,
                        liquidation: 'Liquidation 1'
                    }
                ],
                shareholders: [
                    {
                        name: 'Shareholder name 1',
                        type: 'individual',
                        invitedEmail: 'sh1@yopmail.com',
                        address: 'Address Loc 1'
                    }
                ]
            })
            .expect(401);
    });

    it(`should return 200 OK if captable is initialized`, async () => {

        const {body} = await request(app)
            .post('/v1/captable/initialize')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Company Name',
                incDate: '2018/08/01',
                website: 'https://localhost:5000',
                currency: 'EUR',
                country: 'US',
                state: 'STATE',
                funding: 'Not Raised Any Money',
                role: 'owner',
                securities: [
                    {
                        type: 'warrant',
                        name: 'Security name 1',
                        authorized: 12343,
                        liquidation: 'Liquidation 1'
                    }
                ],
                shareholders: [
                    {
                        name: 'Shareholder name 1',
                        type: 'individual',
                        invitedEmail: 'sh1@yopmail.com',
                        address: 'Address Loc 1'
                    }
                ]
            })
            .expect(200);

        should(body).have.property('status', 'success');
    });
});
