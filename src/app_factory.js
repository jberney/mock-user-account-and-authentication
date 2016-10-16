const bodyParser = require('body-parser');
const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp() {
        const app = express();
        app.use(bodyParser.json());
        app.use('/uaa', RouterFactory.newRouter());
        return app;
    }
};