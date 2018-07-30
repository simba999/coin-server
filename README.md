# ISHU-SERVER API

**1. Authentication**
-----


**2. Account**
-----

Company API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Create Company

        - Endpoint: /v1/accounts
        - Method: POST
        - Request:
            {
                "type":"company",
                "name":"Test Company1",
                "incDate": "2017/07/30",
                "website": "http://localhost",
                "currency": "usd",
                "country": "united state",
                "state": "new york",
                "funding": "Not Raised Any Money"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "type": "company",
                    "name": "Test Company1",
                    "incDate": "2017-07-29",
                    "website": "http://localhost",
                    "currency": "usd",
                    "country": "united state",
                    "state": "new york",
                    "funding": "Not Raised Any Money",
                    "updated_at": "2018-07-30T13:42:01.878Z",
                    "created_at": "2018-07-30T13:42:01.878Z",
                    "deleted_at": null
                }
            }
            
- Update Company

        - Endpoint: /v1/accounts
        - Method: PUT
        - Request:
            {
                "accountId": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                "type":"company",
                "name":"Test Company1",
                "incDate": "2017/07/30",
                "website": "http://localhost",
                "currency": "usd",
                "country": "united state",
                "state": "new york",
                "funding": "Not Raised Any Money"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "type": "company",
                    "name": "Test Company1",
                    "incDate": "2017-07-29T22:00:00.000Z",
                    "website": "http://localhost",
                    "currency": "usd",
                    "country": "united state",
                    "state": "new york",
                    "funding": "Not Raised Any Money",
                    "created_at": "2018-07-30T13:42:01.878Z",
                    "updated_at": "2018-07-30T15:44:12.033Z",
                    "deleted_at": null
                }
            }
            
- Get Company Info

        - Endpoint: /v1/accounts/:uuid
            :uuid   String
        - Method: GET
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "type": "company",
                    "name": "Test Company1",
                    "incDate": "2017-07-29",
                    "website": "http://localhost",
                    "currency": "usd",
                    "country": "united state",
                    "state": "new york",
                    "funding": "Not Raised Any Money",
                    "created_at": "2018-07-30T13:42:01.878Z",
                    "updated_at": "2018-07-30T13:44:12.033Z",
                    "deleted_at": null
                }
            }
            
- Delete Company Info

        - Endpoint: /v1/accounts/:uuid
            :uuid   String
        - Method: DELETE
        - Response:
            {
                "status": "success"
            }
            
**3. Security**
-----

Security API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Create Security

        - Endpoint: /v1/security
        - Method: POST
        - Request:
            {
                "type":"warrant",
                "name":"Security 1",
                "accountId":"bcde20bb-eae2-409f-9f48-3dd46709c191",
                "authorized":21,
                "liquidation": "liquidation 1"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "26716619-b2a2-4f41-a7b3-e80110292c3d",
                    "type": "warrant",
                    "name": "Security 1",
                    "accountId": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "authorized": 21,
                    "liquidation": "liquidation 1",
                    "updated_at": "2018-07-30T13:47:51.793Z",
                    "created_at": "2018-07-30T13:47:51.793Z",
                    "deleted_at": null
                }
            }
            
- Update Security

        - Endpoint: /v1/security
        - Method: PUT
        - Request:
            {
                "securityId":"26716619-b2a2-4f41-a7b3-e80110292c3d",
                "type":"warrant",
                "name":"Security 1",
                "accountId":"bcde20bb-eae2-409f-9f48-3dd46709c191",
                "authorized":21,
                "liquidation": "liquidation 2"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "26716619-b2a2-4f41-a7b3-e80110292c3d",
                    "name": "Security 1",
                    "type": "warrant",
                    "authorized": 21,
                    "liquidation": "liquidation 2",
                    "accountId": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "created_at": "2018-07-30T13:47:51.793Z",
                    "updated_at": "2018-07-30T15:49:56.457Z",
                    "deleted_at": null
                }
            }
            
- Get Security Info

        - Endpoint: /v1/security/:uuid
            :uuid   String
        - Method: GET
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "26716619-b2a2-4f41-a7b3-e80110292c3d",
                    "name": "Security 1",
                    "type": "warrant",
                    "authorized": 21,
                    "liquidation": "liquidation 2",
                    "accountId": "bcde20bb-eae2-409f-9f48-3dd46709c191",
                    "created_at": "2018-07-30T13:47:51.793Z",
                    "updated_at": "2018-07-30T15:49:56.457Z",
                    "deleted_at": null
                }
            }
            
- Delete Security Info

        - Endpoint: /v1/security/:uuid
            :uuid   String
        - Method: DELETE
        - Response:
            {
                "status": "success"
            }
            
**4. Shareholder**
-----

Shareholder API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Create Shareholder

        - Endpoint: /v1/shareholder
        - Method: POST
        - Request:
            {  
                "name": "Shareholder 1",
                "type": "individual",
                "invitedEmail":"alex@ishu.io",
                "address": "Address line 1"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "6f93c9d4-51a0-497d-9f71-a07961d78e97",
                    "name": "Shareholder 1",
                    "type": "individual",
                    "invitedEmail": "alex@ishu.io",
                    "address": "Address line 1",
                    "updated_at": "2018-07-30T13:52:49.813Z",
                    "created_at": "2018-07-30T13:52:49.813Z",
                    "deleted_at": null
                }
            }
            
- Update Shareholder

        - Endpoint: /v1/shareholder
        - Method: PUT
        - Request:
            {  
                "shareholderId": "6f93c9d4-51a0-497d-9f71-a07961d78e97",
                "name": "Shareholder 3",
                "type": "individual",
                "invitedEmail":"alex@ishu.io",
                "address": "Address line 1"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "6f93c9d4-51a0-497d-9f71-a07961d78e97",
                    "name": "Shareholder 3",
                    "type": "individual",
                    "invitedEmail": "alex@ishu.io",
                    "address": "Address line 1",
                    "created_at": "2018-07-30T13:52:49.813Z",
                    "updated_at": "2018-07-30T15:53:57.932Z",
                    "deleted_at": null
                }
            }
            
- Get Shareholder Info

        - Endpoint: /v1/shareholder/:uuid
            :uuid   String
        - Method: GET
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "6f93c9d4-51a0-497d-9f71-a07961d78e97",
                    "name": "Shareholder 3",
                    "type": "individual",
                    "invitedEmail": "alex@ishu.io",
                    "address": "Address line 1",
                    "created_at": "2018-07-30T13:52:49.813Z",
                    "updated_at": "2018-07-30T15:53:57.932Z",
                    "deleted_at": null
                }
            }
            
- Delete Shareholder Info

        - Endpoint: /v1/shareholder/:uuid
            :uuid   String
        - Method: DELETE
        - Response:
            {
                "status": "success"
            }
            
**5. SecurityTransaction**
-----

SecurityTransaction API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Create SecurityTransaction

        - Endpoint: /v1/security-transaction
        - Method: POST
        - Request:
            {
                "status": false,
                "shares": 100,
                "price": 20,
                "restricted": false,
                "restrictedUntil": "2018/07/25",
                "issueDate": "2018/07/25",
                "securityId": "46c09960-173e-4e6a-86a4-80d9c2b1190e",
                "shareholderId": "0405befe-7339-4e60-9317-c967cedae787"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "5576302e-94fb-4ec2-846c-4a21d6df4600",
                    "status": false,
                    "shares": 100,
                    "price": 20,
                    "restricted": false,
                    "restrictedUntil": "2018-07-24",
                    "issueDate": "2018-07-24",
                    "securityId": "46c09960-173e-4e6a-86a4-80d9c2b1190e",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "updated_at": "2018-07-25T20:44:45.843Z",
                    "created_at": "2018-07-25T20:44:45.843Z",
                    "deleted_at": null
                }
            }
            
- Update SecurityTransaction Info

        - Endpoint: /v1/security-transaction
        - Method: PUT
        - Request:
            {
                "securityTransactionId": "5576302e-94fb-4ec2-846c-4a21d6df4600",
                "status": false,
                "shares": 100,
                "price": 20,
                "restricted": false,
                "restrictedUntil": "2018/07/26",
                "issueDate": "2018/07/26"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "5576302e-94fb-4ec2-846c-4a21d6df4600",
                    "status": false,
                    "shares": 100,
                    "price": 20,
                    "restricted": false,
                    "restrictedUntil": "2018-07-25T22:00:00.000Z",
                    "issueDate": "2018-07-25T22:00:00.000Z",
                    "securityId": "46c09960-173e-4e6a-86a4-80d9c2b1190e",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "created_at": "2018-07-25T20:44:45.843Z",
                    "updated_at": "2018-07-25T22:55:11.970Z",
                    "deleted_at": null
                }
            }
            
- Get SecurityTransaction Info

        - Endpoint: /v1/security-transaction/:uuid
            :uuid   String
        - Method: GET
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "5576302e-94fb-4ec2-846c-4a21d6df4600",
                    "status": false,
                    "shares": 100,
                    "price": 20,
                    "restricted": false,
                    "restrictedUntil": "2018-07-25",
                    "issueDate": "2018-07-25",
                    "securityId": "46c09960-173e-4e6a-86a4-80d9c2b1190e",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "created_at": "2018-07-25T20:44:45.843Z",
                    "updated_at": "2018-07-25T20:55:11.970Z",
                    "deleted_at": null
                }
            }
            
- Delete SecurityTransaction Info

        - Endpoint: /v1/security-transaction/:uuid
            :uuid   String
        - Method: DELETE
        - Response:
            {
                "status": "success"
            }
                        
**6. CapTable API**
-----

CapTable API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Initialize Cap tables data

        - Endpoint: /v1/captable/initialize
        - Method: POST
        - Request:
            {
                "companyName": "Test Company1",
                "incDate": "2018/07/28",
                "website": "https://localhost:5000",
                "currency": "EUR",
                "country": "US",
                "state": "STATE",
                "funding": "Not Raised Any Money",
                "role": "owner",
                "securities": [
                    {
                        "type": "warrant",
                        "name": "class1",
                        "authorized": 32342,
                        "liquidation": "liquidation 1"
                    },
                    {
                        "type": "warrant",
                        "name": "class2",
                        "authorized": 1232,
                        "liquidation": "liquidation 2"
                    }
                ],
                "shareholders": [
                    {
                        "name": "shareholder 1",
                        "type": "employee",
                        "invitedEmail": "sh1@yopmail.com",
                        "address": "address 1"
                    },
                    {
                        "name": "shareholder 2",
                        "type": "employee",
                        "invitedEmail": "sh2@yopmail.com",
                        "address": "address 2"
                    }
                ]
            }
        - Response:
            {
                'status': 'success',
                'data': {
                    'message': 'Created successfully'
                }
            }