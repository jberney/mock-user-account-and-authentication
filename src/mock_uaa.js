const uuid = require('node-uuid');
const values = require('object.values');

const html = () => [
    '<form method="post">',
    '<input name="username">',
    '<input name="password" type="password">',
    '<input type="submit">',
    '</form>'
].join('\n');

function redirect(req, res) {
    req.session.loggedIn = Date.now();
    const accessToken = ['junk', new Buffer(JSON.stringify({
        user_name: req.body.username,
        user_id: 'USER_GUID',
        scope: ['cloud_controller.admin', 'usage_service.audit']
    })).toString('base64')].join('.');
    const hash = ['access_token', accessToken].join('=');
    const redirectUrl = [req.query.redirect_uri, hash].join('#');
    res.redirect(301, redirectUrl);
};

module.exports = {
    html,
    getOauthAuthorize (req, res) {
        if (req.session.loggedIn) {
            return redirect(req, res);
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(html());
    },
    getUsers(state) {
        return (req, res) => {
            const {attributes = '', filter} = req.query;
            const filterElements = filter.split(' ', 3);
            const filterField = filterElements[0];
            const filterOperator = filterElements[1];
            const filterValue = JSON.parse(decodeURIComponent(filterElements[2]));
            const filtered = values(state.users).filter(user => {
                switch (filterOperator) {
                    case 'Eq':
                        return user[filterField] == filterValue;
                }
            });
            if (filtered.length === 0) {
                const description = `No user found where ${filter}`;
                return res.status(502) && res.json({description});
            }
            let attributesList = attributes.split(',');
            const resources = filtered.map(resource => {
                const mapped = {};
                attributesList.forEach(attribute => {
                    mapped[attribute] = resource[attribute];
                });
                return mapped;
            });
            res.json({resources});
        };
    },
    logout(req, res) {
        req.session && delete req.session.loggedIn;
        res.setHeader('Content-Type', 'text/html');
        res.send(html());
    },
    postOauthToken(req, res) {
        const accessToken = uuid.v4();
        res.json({
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 3600
        });
    },
    postUsers(state) {
        return (req, res) => {
            req.body.id = uuid.v4();
            state.users[req.body.id] = Object.assign({}, state.users[req.body.id], req.body);
            res.json(state.users[req.body.id]);
        };
    },
    redirect
};