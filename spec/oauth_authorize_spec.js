const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request} = require('./spec_helper');

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
        const headers = {'Content-Type': 'text/html'};
        const body = {};
        const accessToken = 'eyJ1c2VyX25hbWUiOiJVU0VSTkFNRSIsInVzZXJfaWQiOiJVU0VSSUQiLCJzY29wZSI6WyJjbG91ZF9jb250cm9sbGVyLmFkbWluIiwidXNhZ2Vfc2VydmljZS5hdWRpdCJdfQ==';
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

});