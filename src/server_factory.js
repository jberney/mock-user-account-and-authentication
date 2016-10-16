const http = require('http');

const AppFactory = require('./app_factory');

module.exports = {
    newServer(port, callback) {
        return http.createServer(AppFactory.newApp())
            .listen(port, callback);
    }
};