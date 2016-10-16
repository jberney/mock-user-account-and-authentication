const uuid = require('node-uuid');

const {assertResponse, caught, request} = require('./spec_helper');

describe('OAuth Token Endpoint', () => {

    const port = 9000;

    let ServerFactory, server;
    beforeEach(() => {
        ServerFactory = require('../src/server_factory');
        spyOn(uuid, 'v4').and.returnValue('ACCESS_TOKEN');
    });

    afterEach(() => {
        server && server.close();
    });

    describe('POST /oauth/token', () => {
        const method = 'post';
        const path = '/oauth/token';
        beforeEach(done => {
            server = ServerFactory.newServer(port, done);
        });
        it('with client credentials', done => {
            const expected = {
                access_token: 'ACCESS_TOKEN',
                token_type: 'bearer',
                expires_in: 3600
            };
            request({method, path})
                .then(assertResponse(expected))
                .then(done)
                .catch(caught(done));
        });

    });

});