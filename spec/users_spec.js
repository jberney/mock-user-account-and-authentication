const uuid = require('node-uuid');

const {assertCatch, assertResponse, caught, request} = require('./spec_helper');

describe('Users', () => {

    const port = Math.round(1000 + Math.random() * 60000);

    let ServerFactory, server, state;
    beforeEach(done => {
        ServerFactory = require('../src/server_factory');
        spyOn(uuid, 'v4').and.returnValue('USER_ID');
        state = {users: {}};
        done();
    });


    afterEach(() => {
        server && server.close();
    });

    describe('GET /Users', () => {
        const method = 'get';
        const path = '/Users?attributes=id,userName&filter=userName+Eq+%22USER_NAME%22';
        describe('when there is a matching user', () => {
            beforeEach(done => {
                state.users.USER_ID = {
                    id: 'USER_ID',
                    userName: 'USER_NAME',
                    active: true
                };
                server = ServerFactory.newServer({
                    state,
                    port
                }, done);
            });
            it('returns the user', done => {
                request({method, port, path})
                    .then(assertResponse({
                        id: 'USER_ID',
                        userName: 'USER_NAME'
                    }))
                    .then(() => expect(state.users.USER_ID).toEqual({
                        id: 'USER_ID',
                        userName: 'USER_NAME',
                        active: true
                    }))
                    .then(done)
                    .catch(caught(done));
            });
        });
        describe('when there is no matching user', () => {
            beforeEach(done => {
                server = ServerFactory.newServer({
                    state,
                    port
                }, done);
            });
            const description = 'No user found where userName Eq "USER_NAME"';
            it('returns a 500', done => {
                request({method, port, path})
                    .then(response => console.log(response) || expect(true).toBeFalsy() || done())
                    .catch(assertCatch({description}, done));
            });
        });
    });

    describe('POST /Users', () => {
        const method = 'post';
        const path = '/Users';
        const body = {
            "externalId": "test-user",
            "meta": {
                "version": 0,
                "created": "2016-09-26T20:58:16.123Z"
            },
            "userName": "MFP9gr@test.org",
            "name": {
                "formatted": "given name family name",
                "familyName": "family name",
                "givenName": "given name"
            },
            "emails": [{
                "value": "MFP9gr@test.org",
                "primary": true
            }],
            "phoneNumbers": [{
                "value": "5555555555"
            }],
            "active": true,
            "verified": true,
            "origin": "",
            "password": "secret",
            "schemas": ["urn:scim:schemas:core:1.0"]
        };
        beforeEach(done => server = ServerFactory.newServer({
            state,
            port
        }, done));
        it('with client credentials', done => {
            const expected = JSON.parse(JSON.stringify(body));
            expected.id = 'USER_ID';
            request({method, port, path, body})
                .then(assertResponse(expected))
                .then(() => expect(state.users.USER_ID).toEqual(expected))
                .then(done)
                .catch(caught(done));
        });
    });

});