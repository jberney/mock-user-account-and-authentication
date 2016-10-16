const bodyParser = require('body-parser');
const express = require('express');

const RouterFactory = require('./router_factory');

module.exports = {
    newApp() {
        const app = express();
        app.use(function (req, res, next) {
            console.log(`${req.method} ${req.url}`);
            if (req.body) console.log(req.body);
            next();
        });
        app.use(bodyParser.json());
        app.use('/uaa', RouterFactory.newRouter());
        return app;
    }
};