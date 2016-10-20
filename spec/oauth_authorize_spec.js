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
                .then(assertResponse(MockUaa.html()))
                .then(done)
                .catch(caught(done));
        });

    });

});