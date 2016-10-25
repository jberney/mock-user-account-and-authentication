const MockUaa = require('../src/mock_uaa');
const {assertResponse, caught, request} = require('./spec_helper');

describe('Invitations Accept Endpoint', () => {

    const port = Math.round(1000 + Math.random() * 60000);

    let res, ServerFactory, server;
    beforeEach(() => {
        res = jasmine.createSpyObj('res', ['setHeader', 'send']);
        ServerFactory = require('../src/server_factory');
    });

    afterEach(() => {
        server && server.close();
    });

    describe('GET /invitations/accept', () => {
        const method = 'get';
        const path = '/invitations/accept?code=CODE';
        const headers = {Accept: 'text/html'};

        beforeEach(done => {
            server = ServerFactory.newServer({port}, done);
        });
        it('returns invitations accept html form', done => {
            request({method, port, path, headers})
                .then(assertResponse({statusCode: 200, body: MockUaa.acceptInvitationHtml('CODE')}))
                .then(done)
                .catch(caught(done));
        });
    });

    describe('POST /invitations/accept', () => {
        const method = 'post';
        const path = '/invitations/accept';
        const headers = {Accept: 'text/plain', 'Content-Type': 'application/x-www-form-urlencoded'};
        const body = {
            password: 'secret',
            password_confirmation: 'secret',
            redirect_uri: encodeURIComponent('REDIRECT_URI')
        };
        const expected = 'Moved Permanently. Redirecting to REDIRECT_URI';

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