# ISHU-SERVER API

**1. Authentication**
-----


**2. Company**
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
                "name":"Test Company1"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                    "type": "company",
                    "name": "Test Company1",
                    "updated_at": "2018-07-23T17:16:26.141Z",
                    "created_at": "2018-07-23T17:16:26.141Z",
                    "deleted_at": null
                }
            }
            
- Update Company

        - Endpoint: /v1/accounts
        - Method: PUT
        - Request:
            {
                "accountId":"0d7cd12a-3261-45d2-a4ee-1b7db746cde7", 
                "type":"company",
                "name":"Updated Test Company"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                    "type": "company",
                    "name": "Test Company1",
                    "created_at": "2018-07-23T17:16:26.141Z",
                    "updated_at": "2018-07-23T17:16:26.141Z",
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
                    "uuid": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                    "type": "company",
                    "name": "Test Company1",
                    "created_at": "2018-07-23T17:16:26.141Z",
                    "updated_at": "2018-07-23T17:16:26.141Z",
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
                "accountId":"5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                "securityClass":"Security Class 1",
                "authorized":21,
                "issued":12000,
                "tokenized":"Token 1"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "ddff62bb-83d6-42c9-81f6-8fcd1b0b0a3d",
                    "type": "warrant",
                    "name": "Security 1",
                    "accountId": "5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "securityClass": "Security Class 1",
                    "authorized": 21,
                    "issued": 12000,
                    "tokenized": "Token 1",
                    "underlyingSecurity": "76c7e3ff-6bb7-44ea-864f-2109a259233f",
                    "updated_at": "2018-07-23T19:35:46.106Z",
                    "created_at": "2018-07-23T19:35:46.106Z",
                    "deleted_at": null
                }
            }
            
- Update Security

        - Endpoint: /v1/security
        - Method: PUT
        - Request:
            {
                {
                    "type":"warrant",
                    "securityId":"ddff62bb-83d6-42c9-81f6-8fcd1b0b0a3d",
                    "name":"Security 11",
                    "accountId":"5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "underlyingSecurity":"5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "securityClass":"Security Class 11",
                    "authorized":21,
                    "issued":12000,
                    "tokenized":"Token 11"
                }
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "ddff62bb-83d6-42c9-81f6-8fcd1b0b0a3d",
                    "name": "Security 11",
                    "type": "warrant",
                    "underlyingSecurity": "5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "accountId": "5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "securityClass": "Security Class 11",
                    "authorized": 21,
                    "issued": 12000,
                    "tokenized": "Token 11",
                    "created_at": "2018-07-23T19:35:46.106Z",
                    "updated_at": "2018-07-25T20:24:38.447Z",
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
                    "uuid": "ddff62bb-83d6-42c9-81f6-8fcd1b0b0a3d",
                    "name": "Security 11",
                    "type": "warrant",
                    "underlyingSecurity": "5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "accountId": "5172e1e8-7c0e-47ee-9fe1-082c619de99f",
                    "securityClass": "Security Class 11",
                    "authorized": 21,
                    "issued": 12000,
                    "tokenized": "Token 11",
                    "created_at": "2018-07-23T19:35:46.106Z",
                    "updated_at": "2018-07-25T18:24:38.447Z",
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
                "userId":"2a235b33-d7c1-48d7-9b84-badf18e125a2",
                "invitedEmail":"alex@ishu.io"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0405befe-7339-4e60-9317-c967cedae787",
                    "userId": "2a235b33-d7c1-48d7-9b84-badf18e125a2",
                    "invitedEmail": "alex@ishu.io",
                    "invitedAt": "2018-07-25",
                    "updated_at": "2018-07-25T19:18:16.968Z",
                    "created_at": "2018-07-25T19:18:16.968Z",
                    "deleted_at": null
                }
            }
            
- Update Shareholder

        - Endpoint: /v1/shareholder
        - Method: PUT
        - Request:
            {
                "shareholderId":"0405befe-7339-4e60-9317-c967cedae787",
                "userId":"2a235b33-d7c1-48d7-9b84-badf18e125a2",
                "invitedEmail":"alex1@ishu.io"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0405befe-7339-4e60-9317-c967cedae787",
                    "userId": "2a235b33-d7c1-48d7-9b84-badf18e125a2",
                    "invitedAt": "2018-07-25",
                    "invitedEmail": "alex1@ishu.io",
                    "created_at": "2018-07-25T19:18:16.968Z",
                    "updated_at": "2018-07-25T21:33:50.438Z",
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
                    "uuid": "0405befe-7339-4e60-9317-c967cedae787",
                    "userId": "2a235b33-d7c1-48d7-9b84-badf18e125a2",
                    "invitedAt": "2018-07-25",
                    "invitedEmail": "alex@ishu.io",
                    "created_at": "2018-07-25T19:18:16.968Z",
                    "updated_at": "2018-07-25T19:35:36.668Z",
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
            
**6. ShareholderAccount API**
-----

ShareholderAccount API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Create ShareholderAccount

        - Endpoint: /v1/shareholder-account
        - Method: POST
        - Request:
            {
                "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                "accountId": "927f0f63-735e-4739-8be1-ed2d47eb0cad",
                "role": "owner"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0876d36e-4ab9-4b19-a8a6-54967f3a0905",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "accountId": "927f0f63-735e-4739-8be1-ed2d47eb0cad",
                    "role": "owner",
                    "updated_at": "2018-07-27T04:23:45.428Z",
                    "created_at": "2018-07-27T04:23:45.428Z",
                    "deleted_at": null
                }
            }
            
- Update ShareholderAccount

        - Endpoint: /v1/shareholder-account
        - Method: PUT
        - Request:
            {
                "shareholderAccountId": "0876d36e-4ab9-4b19-a8a6-54967f3a0905",
                "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                "accountId": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                "role": "owner"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0876d36e-4ab9-4b19-a8a6-54967f3a0905",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "accountId": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                    "role": "owner",
                    "created_at": "2018-07-27T04:23:45.428Z",
                    "updated_at": "2018-07-27T06:26:36.181Z",
                    "deleted_at": null
                }
            }
            
- Get ShareholderAccount Info

        - Endpoint: /v1/shareholder-account/:uuid
            :uuid   String
        - Method: GET
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0876d36e-4ab9-4b19-a8a6-54967f3a0905",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "accountId": "0d7cd12a-3261-45d2-a4ee-1b7db746cde7",
                    "role": "owner",
                    "created_at": "2018-07-27T04:23:45.428Z",
                    "updated_at": "2018-07-27T06:26:36.181Z",
                    "deleted_at": null
                }
            }
            
- Delete ShareholderAccount Info

        - Endpoint: /v1/shareholder-account/:uuid
            :uuid   String
        - Method: DELETE
        - Response:
            {
                "status": "success"
            }
            
**7. CapTable API**
-----

CapTable API requires common request header: 

        Content-Type: application/json
        Authorization: Bearer 'Token'
        
- Initialize Cap tables data

        - Endpoint: /v1/initialize
        - Method: POST
        - Request:
            {
                "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                "accountId": "927f0f63-735e-4739-8be1-ed2d47eb0cad",
                "role": "owner"
            }
        - Response:
            {
                "status": "success",
                "data": {
                    "uuid": "0876d36e-4ab9-4b19-a8a6-54967f3a0905",
                    "shareholderId": "0405befe-7339-4e60-9317-c967cedae787",
                    "accountId": "927f0f63-735e-4739-8be1-ed2d47eb0cad",
                    "role": "owner",
                    "updated_at": "2018-07-27T04:23:45.428Z",
                    "created_at": "2018-07-27T04:23:45.428Z",
                    "deleted_at": null
                }
            }