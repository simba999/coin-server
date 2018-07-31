# ISHU-SERVER API

**1. Authentication**
-----

- User Sign up
        
        - Endpoint: /v1/signup
        - Method: POST
        - Request:
            {
                "firstName":"Test first 1",
                "lastName":"Test last 1",
                "phone":"1239876573",
                "email":"test@yopmail.com",
                "password":"Test!2345"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "message": "Created user successfully"
                }
            }
            
- User Sign in
        
        - Endpoint: /v1/signin
        - Method: POST
        - Request:
            {
                "email": "un@yopmail.com",
                "password": "jfieh12393k"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "type": "Bearer",
                    "expiresIn": 86400,
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGQxMDEwOC05N2I1LTQ2ZGMtOTAyNC0xYjdkYWU4MTBhOWEiLCJpYXQiOjE1MzMwNDIyMTIsImV4cCI6MTUzMzEyODYxMn0.Y9LuZ4gpsCQLJ0WScBHQuciMlGzMn8qU6Umf_ZZGLYY"
                }
            }
            
- Change password
        
        - Endpoint: /v1/user/password
        - Method: PUT
        - Request:
            {
                "password": "jfieh12393k",
                "currentPassword": "kugnb4352ft"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "message": "Changed password successfully",
                    "uuid": "9dd10108-97b5-46dc-9024-1b7dae810a9a"
                }
            }

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
                    "message": "Created account successfully",
                    "uuid": "c72b37ed-9582-4120-a062-0065fd7b4ba6"
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
                    "message": "Updated account successfully",
                    "uuid": "5a269bb3-a851-4d9c-bef3-d9177bd038c7"
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
                    "message": "Created security successfully",
                    "uuid": "ddfa7024-812e-4f1f-92be-ab167010549b"
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
                    "message": "Updated account successfully",
                    "uuid": "ddfa7024-812e-4f1f-92be-ab167010549b"
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
                    "message": "Created shareholder successfully",
                    "uuid": "dcfa41cc-ba5c-45c6-a196-0481376c3171"
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
                    "message": "Updated shareholder successfully",
                    "uuid": "dcfa41cc-ba5c-45c6-a196-0481376c3171"
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
                    "message": "Created security transaction successfully",
                    "uuid": "2218f615-975b-463c-a6db-85ef8e6464d0"
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
                    "message": "Updated security transaction successfully",
                    "uuid": "2218f615-975b-463c-a6db-85ef8e6464d0"
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