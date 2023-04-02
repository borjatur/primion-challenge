# Getting started

* docker run -d --name redis -p 6379:6379 redis:latest
* npm link (within proto folder, this would generate a local proto package that all services will use later on)
* npm install && npm run proto:install && npm run proto:all && npm run start:dev (per each service)

# Overview
* users-service (gRPC, Redis client)
* departments-service (gRPC, Redis transport)
* api-gateway (http)

# TODO
- Clean architecture (there are still some coupled components, e.g. TypeORM repo with services)
- Testing
- Review duplications

# Questions
1. What is and how to manage Authentication?
2. What is and how to manage Authorization?
3. What security concerns could you apply at different defined layers (API Gateway/Services)?
4. How will you manage intensive tasks in NodeJS?
5. What is the Event Loop?
6. How you monitor the system, what tools have you used?