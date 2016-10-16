const bodyParser = require('body-parser');
const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp(state = {}) {
        const app = express();
        app.use(bodyParser.json());
        app.use(function (req, res, next) {
            let log = `[UAA] ${req.method} ${req.url}`;
            if (['POST', 'PUT'].includes(req.method)) log = `${log} ${JSON.stringify(req.body)}`;
            console.log(log);
            next();
        });
        app.use(RouterFactory.newRouter(state));
        return app;
    }
};