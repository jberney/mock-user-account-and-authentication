const {Router} = require('express');
const multipart = require('connect-multiparty');

const MockUaa = require('./mock_uaa');

module.exports = {
    newRouter(state) {
        const router = new Router();
        router.get('/oauth/authorize', MockUaa.getOauthAuthorize);
        router.get('/Users', MockUaa.getUsers(state));
        router.post('/oauth/authorize', multipart(), MockUaa.redirect);
        router.post('/oauth/token', MockUaa.postOauthToken);
        router.post('/Users', MockUaa.postUsers(state));
        return router;
    }
};