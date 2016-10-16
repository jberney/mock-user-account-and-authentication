const {Router} = require('express');

const MockUaa = require('./mock_uaa');

module.exports = {
    newRouter() {
        const router = new Router();
        router.post('/oauth/token', MockUaa.postOauthToken);
        return router;
    }
};