const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const uuid = require('node-uuid');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp(state = {}) {
        const app = express();
        app.set('trust proxy', 1);
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: uuid.v4()
        }));
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