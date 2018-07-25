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