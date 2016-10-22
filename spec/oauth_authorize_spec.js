const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request, postForm} = require('./spec_helper');

describe('OAuth Token Endpoint', () => {

    const port = Math.round(1000 + Math.random() * 60000);

    let res, ServerFactory, server;
    beforeEach(() => {
        res = jasmine.createSpyObj('res', ['setHeader', 'send']);
        ServerFactory = require('../src/server_factory');
    });

    afterEach(() => {
        server && server.close();
    });

    describe('GET /oauth/authorize', () => {
        const method = 'get';
        const path = '/oauth/authorize';
        const headers = {'Content-Type': 'text/html'};

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('returns oauth authorization html form', done => {
            request({method, port, path, headers})
                .then(assertResponse({statusCode: 200, body: MockUaa.html()}))
                .then(done)
                .catch(caught(done));
        });
    });

    describe('POST /oauth/authorize', () => {
        const method = 'post';
        const path = '/oauth/authorize';
        const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        const body = {
            username: 'user@example.com',
            password: 'secret'
        };
        const accessToken = 'eyJ1c2VyX2lkIjoiVVNFUl9HVUlEIiwic2NvcGUiOlsiY2xvdWRfY29udHJvbGxlci5hZG1pbiIsInVzYWdlX3NlcnZpY2UuYXVkaXQiXX0=';
        const expected = `Moved Permanently. Redirecting to #access_token=junk.${accessToken}`;

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('301 redirects', done => {
            request({method, port, path, headers, body})
                .then(assertResponse({statusCode: 301, body: expected}))
                .then(done)
                .catch(caught(done));
        });
    });

    describe('POST, GET /oauth/authorize', () => {
        const method = 'post';
        const path = '/oauth/authorize';
        const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        const body = {
            username: 'user@example.com',
            password: 'secret'
        };
        const accessToken = 'eyJ1c2VyX2lkIjoiVVNFUl9HVUlEIiwic2NvcGUiOlsiY2xvdWRfY29udHJvbGxlci5hZG1pbiIsInVzYWdlX3NlcnZpY2UuYXVkaXQiXX0,=';
        const expected = `Moved Permanently. Redirecting to #access_token=junk.${accessToken}`;

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('301 redirects on the GET', done => {
            request({method, port, path, headers, body})
                .then(response => ({cookie: response.headers['set-cookie'][0]}))
                .then(headers => request({method: 'get', port, path, headers}))
                .then(assertResponse({statusCode: 301, body: expected}))
                .then(done)
                .catch(caught(done));
        });
    });

});