const uuid = require('node-uuid');
const values = require('object.values');

module.exports = {
    getUsers: state => {
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
            const result = {};
            attributes.split(',').forEach(attribute => {
                result[attribute] = filtered[0][attribute];
            });
            res.json(result);
        };
    },
    postOauthToken: (req, res) => {
        const accessToken = uuid.v4();
        res.json({
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 3600
        });
    },
    postUsers: state => {
        return (req, res) => {
            req.body.id = uuid.v4();
            state.users[req.body.id] = req.body;
            res.json(state.users[req.body.id]);
        };
    }
};