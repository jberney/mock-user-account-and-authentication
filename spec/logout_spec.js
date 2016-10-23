const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request} = require('./spec_helper');

describe('Logout', () => {

    const port = Math.round(1000 + Math.random() * 60000);

    let res, ServerFactory, server;
    beforeEach(() => {
        res = jasmine.createSpyObj('res', ['setHeader', 'send']);
        ServerFactory = require('../src/server_factory');
    });

    afterEach(() => {
        server && server.close();
    });

    describe('GET /logout', () => {
        const method = 'get';
        const path = '/logout';
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

    describe('POST, GET /logout', () => {
        const method = 'post';
        const path = '/oauth/authorize';
        const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        const body = {
            username: 'user@example.com',
            password: 'secret'
        };

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('301 redirects on the GET', done => {
            request({method, port, path, headers: {Accept: 'text/html'}, body})
                .then(response => ({cookie: response.headers['set-cookie'][0]}))
                .then(headers => request({method: 'get', port, path: '/logout', headers: {Accept: 'text/html'}}))
                .then(assertResponse({statusCode: 200, body: MockUaa.html()}))
                .then(done)
                .catch(caught(done));
        });
    });

});