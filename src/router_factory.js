const {Router} = require('express');

const MockUaa = require('./mock_uaa');

module.exports = {
    newRouter(state) {
        const router = new Router();
        router.post('/oauth/token', MockUaa.postOauthToken);
        router.post('/Users', MockUaa.postUsers(state));
        return router;
    }
};