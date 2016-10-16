const uuid = require('node-uuid');

function sendJson(res, obj) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
};

module.exports = {
    postOauthToken: (req, res) => {
        const accessToken = uuid.v4();
        sendJson(res, {
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 3600
        });
    }
};