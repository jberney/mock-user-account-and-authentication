const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request} = require('./spec_helper');

describe('OAuth Authorize Endpoint', () => {

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

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('301 redirects', done => {
            request({method, port, path, headers, body})
                .then(response => {
                    const location = response.headers.location;
                    const tokenTail = location.split('.').pop();
                    expect(location).toMatch(`^#access_token=junk\.${tokenTail}$`);
                    const tokenData = JSON.parse(Buffer.from(tokenTail, 'base64').toString('utf8'));
                    expect(tokenData.user_name).toBe('user@example.com');
                    expect(tokenData.user_id).toBe('USER_GUID');
                    expect(tokenData.scope).toEqual(['cloud_controller.admin', 'usage_service.audit']);
                    return response;
                })
                .then(assertResponse({statusCode: 301}))
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
                .then(response => {
                    const location = response.headers.location;
                    const tokenTail = location.split('.').pop();
                    expect(location).toMatch(`^#access_token=junk\.${tokenTail}$`);
                    const tokenData = JSON.parse(Buffer.from(tokenTail, 'base64').toString('utf8'));
                    expect(tokenData.username).toBeFalsy();
                    expect(tokenData.user_id).toBe('USER_GUID');
                    expect(tokenData.scope).toEqual(['cloud_controller.admin', 'usage_service.audit']);
                    return response;
                })
                .then(assertResponse({statusCode: 301}))
                .then(done)
                .catch(caught(done));
        });
    });

});