## Configuración Serveless offline

* npm install --save-dev @types/aws-lambda
* npm install express cors winston @vendia/serverless-express
* npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
* npm install --save-dev serverless-dynamodb-local
* npm install aws-sdk
* npm install --save-dev jest ts-jest @types/jest supertest @types/supertest


## Runear en Local
* serverless offline start
* docker compose up --build

* serverless package
* serverless deploy --aws-profile serverless