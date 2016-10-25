const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request} = require('./spec_helper');

describe('OAuth Authorize Endpoint', () => {

    const accessToken = (user_name) => ['junk', new Buffer(JSON.stringify({
        user_name,
        user_id: 'USER_GUID',
        scope: ['cloud_controller.admin', 'usage_service.audit']
    })).toString('base64')].join('.');

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
        const headers = {Accept: 'text/html'};

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
        const headers = {
            Accept: 'text/plain',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const body = {
            username: 'user@example.com',
            password: 'secret'
        };
        const expected = `Moved Permanently. Redirecting to #access_token=${accessToken('user@example.com')}`;

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
        const headers = {
            Accept: 'text/plain',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const body = {
            username: 'user@example.com',
            password: 'secret'
        };
        const expected = `Moved Permanently. Redirecting to #access_token=${accessToken()}`;

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('301 redirects on the GET', done => {
            request({method, port, path, headers, body})
                .then(response => ({
                    Accept: 'text/plain',
                    Cookie: response.headers['set-cookie'][0]
                }))
                .then(headers => request({method: 'get', port, path, headers}))
                .then(assertResponse({statusCode: 301, body: expected}))
                .then(done)
                .catch(caught(done));
        });
    });

});