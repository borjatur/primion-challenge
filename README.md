# Getting started

## The easy way
* make prepare && make start && make status

## The hard way
* docker run -d --name redis -p 6379:6379 redis:latest
* npm link (within proto folder, this would generate a local proto package that all services will use later on)
* npm install && npm run proto:install && npm run proto:all && npm run start:dev (per each service)

# Overview
* users-service (gRPC, Redis client)
* departments-service (gRPC, Redis transport)
* api-gateway (http)
* sqlite as database (easily interchangeable for any other relational db)

# Requirements
- [x] Nest
- [x] Clean Architecture
- [x] Business Requirements
- [x] Using microservices architecture and project structure
- [x] Using DTO's
- [x] Entities
- [x] Layer definition and responsibilities
- [x] Postman collections

# Questions

# 1. What is and how to manage Authentication?
Authentication is the process of verifying the **identity** of an user or process, basically is the answer to the question `who the current user is?`. Lack of authenticaiton when accesing to protected resources is identified by **401** status code returned from API endpoints.

Some common strategies used for authentication are:

* Basic auth
* Cookie auth
* Token auth
* API key auth
* SSO (Single Sign On)
* MFA (Multi Factor Authentication)

## Basic
User crendentials (username, password) are provided, commonly base64 encoded, for each request and the requested service has to verify that they are valid. This method is considered highly insecure and deprecated nowadays.

## Cookie auth
Commonly used in browser applications scope. The specific way of implementing cookie sessions may vary between systems but the genereal process can be describe as follows:
  1. User provides its credentials to a server
  2. Server verify credentials and return a cookie with a session identifier, this id is also persisted in the backend service.
  3. The cookie is managed by the browser and sent in subsequent requests by headers allowing the requested service to decrypt the cookie and check whether is a valid an active session.

This method is still widely used due to its implicit simplicity even though bring other big drawbacks:
  * Vulnerable to CSRF
  * Hard to manage outside browser applications scope
  * Less efficient and scalable than other methods available (e.g. JWT)
  * Cookies are scoped to specific domains in the browser, cookies expedited for example.com can't be sent to foo.com

## Token auth
Token-based authentication is an auth method which allows users to verify their identity with an authorization server. In return receive a unique access token and during the life of the token, users then access to protected resources with the token has been issued for.

## API key auth
API keys are secret tokens used to authenticate requests. Keys are provided per request and need to be validated by the resource server. It’s frequently used for giving access to other systems.

## SSO
Is an authentication scheme that allows a user to log in with a single identifier to any of several software systems.

## MFA
Is an authentication method in which an user is only granted after presenting two or more evidences to an authentication mechanism based on the following premises:
* knowledge (something only the user knows, e.g password)
* possession (something only the user has, e.g. hardware token, mobile app)
* inherence (something only the user is, e.g fingerprint, face...) 

# 2. What is and how to manage Authorization?

Authorization is the process of determining whether an user/system have access to certain resources/actions in a system, it's a second step beyong authentication for limiting and giving grained access control to individual **resouces**. Some common strategies for implementing authorization are:

* **RBAC** (Role-Based Access Control) user/systems are assigned to one or several roles. Roles contains the list of specific permissions that entities attached to the role can assume. Kubernetes 

* **ABAC** (Attribute-Based Access Control) access decisions are based on the attributes of the **subject**, **resource**, **action**, and **environment** involved in an access event.

ABAC can be used to apply attribute-based, fine-grained authorization to the API methods or functions. For instance, a banking API may expose an approveTransaction(transId) method, the flow for authorizing the request could be described as follows:

1. The user, Alice, calls the API method approveTransaction(123)
2. The API receives the call and authenticates the user.
3. An interceptor in the API calls out to the authorization engine (typically called a Policy Decision Point or PDP) and asks: Can Alice approve transaction 123?
4. The PDP retrieves the ABAC policy and necessary attributes.
5. The PDP reaches a decision e.g. Permit or Deny and returns it to the API interceptor
6. If the decision is Permit, the underlying API business logic is called. Otherwise the API returns an error or access denied.

## Note aside
While I've described authentication and authorization without talking about specific technologies to address both concepts, here there are a brief overview of what protocols/standards I've used before.

### OAuth 2.0
OAuth 2.0 specification defines a delegation protocol that is useful for conveying authorization decisions across applications and API's. OAuth is used in a wide variety of applications, including providing mechanisms for user authentication, e.g:

 * The resource owner authenticates to the authorization server in the authorization step
 * The client authenticates to the authorization server in the token endpoint. 

OAuth protocol defines the procedure for getting a token and eventually use that token to access some resources. User/system credentials are managed exclusively for an authorization server and Oauth does not dictate what the authorization server has to do or what exactly the token has to be.

Oauth 2 protocol describe different strategies for providing access tokens, each of them have specific particularities:

  * Authorizaton Code
  * Authorization Code with PKCE
  * Client Credentials
  * Username/password
  * Implicit
  * refresh_token

### JWT Tokens

JWT Token is an open standard for token formats, sometimes is wrongly described as an alternative to Oauth 2.0 but in fact JWT (token format) and OAuth 2 (token based authorization protocol) serve different purposes and can be used both together. JWT's are self-contained and stateless so there is no need to use computing resources (memory or disk persistence) for its management. Given stateless nature is difficult to handle token revocations.

The token follows the structure:

```
BASE64(Header) + . + BASE64(Payload) + . + ALGORITHM(BASE64(Header) + . + BASE64(Payload), secretKey)
```

* Header, contains information about the algorithm used for signature
* Payload, this is customizable an can vary upon system needs but basically contains information related with the user/system the token belongs to and some other metadata fields (exp, iss, sub...)
* Signature, result of applying an encryption algorithm with the formula described above.
  * HMAC symetric algorithm, great disadvantages as rely on same secretKey for issuing token and checking its validity which basically means whoever is in posession of the secretKey can issue valid tokens.
  * RSA and ECDSA for asymmetric encryption, token issuer signs using the private key and whoever need to verify token signature uses the public key. It offers extra level of security over HMAC as the token issuer does not share the same key with third parties.

The main disadvantage of JWT tokens is that are not easy to revoke, a common strategy for implementing token revocation is using a token cache system where tokens are stored temporaly and can be revoked (Blacklisting/Deny list), this also bring a huge disadvantage due to breaks JWT stateless nature. Instead, this issue is commonly addressed by providing short term duration tokens with a refresh_token, in case that a token has to be revoked is invalidating the refresh_token.

### OpenID and OpenID Connect
Special mention to the following protocols because I've not used them in production systems before but I understand them and even they are based on Oauth concepts.

* **OpenID** authentication protocol that allow users to be authenticated by third parties identity providers. Users create accounts selecting an OpenID identity provider and then use those accounts to sign in. Once authenticated, the OpenID provider sends back a token to the website or application, which confirms that the user is who they claim to be.

* **OpenID Connect** is extending OpenID and built on top of OAuth 2.0, it provides a standardized set of APIs for authentication and authorization, as well as support for the JWT format.

# 3. What security concerns could you apply at different defined layers (API Gateway/Services)?

# API Gateway
* make public traffic only available over https, even though that I would manage this out of the scope of the service itself e.g. in a kubernetes cluster by an ingress controller (NGINX) that's the entry point for the service from external public traffic.
* token based authentication, protecting data endpoints from public access. For issuing those tokens an external authorization server that could provide if possible JWT tokens due to being a self contained solution that does not require extra http calls to the token provider.
* ensuring that there is no sensitive data exposed in http responses like anything that could offer information about frameworks or tech stack used, e.g. headers, response messages.
* A mechanism for applying rate limits, depending on what's required this can be likely applied to an external layer as the load balancer or ingress controller under kubernetes.

# gRPC services
Maintain services under a private network, if the are consumed by one single application then isolating network access to a kubernetes namespace by Network Policies might be enought. If multiple consumers of these services are expected then there might be sensinble to enable any of available auth mechanism https://grpc.io/docs/guides/auth/ and/or https for making those services accesible from a public network.

# DATA
* Database, assuming that is running within a private network, creating specific users that will be used in this case for user-service and deparment-service each of those with granted permissions for their specific tables.

* Redis, isolate access to the services required under a private network, apply ACL's if required https://redis.io/docs/management/security/acl/


# 4. How will you manage intensive tasks in NodeJS?

Given that Nodejs is single-threaded, when dealing with intensive tasks (cpu intensive) the most common pitfall is blocking the event loop and ence causing performance issues.

Here there are some of the best practices recommended for dealing with cpu intensive tasks:
* Worker threads, this is built in Nodejs official modules that would allow to launch tasks in other threads releasing load from the main event loop thread while still sharing memory with the main thread.
* Launching child processes is another way of dealing with cpu instensive workloads with the difference of having its own memory allocated and changing the way of communicating with the main process.
* For managing great data transformations/processing would be advisable using streams as a way of divide the whole process in small chunks that would allow efficient use of memory and cpu resources.

In order to provide an effective solution for an intensive task in nodejs would be necessary to know in detail what the task is, there are subtle differences between running threads and processes and sometimes the best architectural decission may be executing an intensive task in a different service without using the nodejs runtime.

There might be several reasons for externalizing CPU extensive tasks from the nodejs runtime env:
* Separation of concerns. e.g web service to launch AI Jobs, the webservice offers a way of invoking a job passing down relevant information for this job to initialice. The webservice inmediatly return a response with a resource that would allow you track the status of the job sent but the task is running in a different scope (AWS Sagemaker, VM's with GPU) and/or other runtime (c++, go) that is effective for that particular task.
* Not having to deal with the complexity overhead of communication between workers or external process unless there is a good reason to do so.

# 5. What is the Event Loop?

The Node.js event loop is the mechanism that allows Node.js to handle asynchronous operations. It's a loop that continuously checks for events in an event queue and executes them in order **as soon as the call stack is empty**.

Whenever an asynchronous operation is initiated, such as http request or a database query, **Node.js passes it off to a separate thread or process to be executed**, this is usually managed by libuv (c++) and the runtime continues with the rest of instructions in the call stack, it does not wait till the task in completed like python will do natively for example, this is why Node.js is considered non blocking for I/O.

Once the asynchronous task is finished, the callback function associated to that task is added to the event queue so it'll be executed eventually when reaching the first position of the queue.

This process described above is happening over and over again in Node.js for asynchronous operations and has been proved to be very efficient for I/O, webservices for data exchange with DB's for example. Each even loop cycle is also called a tick.

The way I've describe the event loop is a simplification of what really is, the truth is that there is not only one single queue for callbacks, instead there are several queues that are used in different phases of the loop. See the following diagram:

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```
orginal source: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick

While a deep anaylis of each of one this phases deserve a special chapter what I want to hightlight is that when analyzing asynchronous tasks in a pragmatic way as part of designing API's (http requests, disk access, connections to other protocols/services) they are part of the poll phase. And when making use of timers setTimeout() and setInterval() both are handled in the timers phase and setImmediate() takes effect between poll and check phases. This is important to keep in mind if you're using those functions with a specific purpose.

# 6. How you monitor the system, what tools have you used?

Microservices exposing metrics about the Node.js runtime (heap usage, event loop related metrics, CPU usage...), also tracking http status codes (number of 2xx's, 4xx's 5xx's) and response times. I've done this before using specific libraries for exposing some metrics in an admin endpoint, like the example in this readme I made some years ago https://github.com/borjatur/hapi-service-toolkit. These metrics would be polled with a specific rate, stored in Elastic Search and available through a dashboard in Grafana and/or Kibana.

There are also solutions using this same aproach with Prometheus exporters where metrics are exposed by the microservice, then data is polled in adecuate rate and indexed in a external storage solution for logs/metrics. Then metrics are available and human readble in a dashboard for analysis (I've used mostly Grafana for this).

Also metrics for the container runtime are valuable for analysis, e.g. analyis of scaling operations, number of container running for specific services over time, at the end having metrics to know the health of a service within the scope of the container orchestration tool.

Also I've used before Dynatrace, where basically you integrate an agent within your container orchestration tool, this agent communicate with services that are using dynatrace sdk to recollect some data and then that information is exposed later on in a dashboard for post analysis. This also allowed to identify some long running queries to the database where to put the focus on for providing other alternatives.

I've used before nodejs built in profiler as well, the specific use case was for analysis of a big performance decrease in general when uplifting hapijs to a new major version available. This way we could confirm that was an specific issue with the framework after changing the event emitter implementation as our microservice performed an extensive use of it. The analysis carried out in this case allowed that this issue never went to a production environment. The process in a nutshell is:

* Running node process with a flag for collecting profiling data
* Run some kind of test that mimics the behaviour you want to anlyze e.g. load test (artillery)
* Run a node command that would transform non human readable profiling data to human readable data
* Analyse the output to see where cpu and event loop ticks are spent

I know about the existence of other monitoring tools like Datadog or Sentry that I believe share the principles exposed before for metrics collection but I haven't use them before specifically.

