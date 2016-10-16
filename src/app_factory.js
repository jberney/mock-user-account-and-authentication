const bodyParser = require('body-parser');
const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp(state = {}) {
        const app = express();
        app.use(bodyParser.json());
        app.use(function (req, res, next) {
            const showBody = ['POST', 'PUT'].includes(req.method);
            const log = `[UAA] ${req.method} ${req.url} ${showBody && JSON.stringify(req.body)}`;
            console.log(log);
            next();
        });
        app.use(RouterFactory.newRouter(state));
        return app;
    }
};