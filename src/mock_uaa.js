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
    },
    postUsers: state => {
        return (req, res) => {
            req.body.id = uuid.v4();
            state.users || (state.users = {});
            state.users[req.body.id] = req.body;
            sendJson(res, state.users[req.body.id]);
        }
    }
};