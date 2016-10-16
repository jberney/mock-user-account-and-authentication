const http = require('http');

const AppFactory = require('./app_factory');

module.exports = {
    newServer({state, port}, callback) {
        return http.createServer(AppFactory.newApp(state))
            .listen(port, callback);
    }
};