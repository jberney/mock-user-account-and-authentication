const http = require('http');

const host = 'localhost';

function handleResponse({isJson, resolve, reject}) {
    return response => {
        const chunks = []
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
        response.on('end', function () {
            let result = {
                statusCode: response.statusCode,
                headers: response.headers,
                body: chunks.join()
            };
            try {
                if (isJson) {
                    result.body = JSON.parse(result.body);
                }
                if (response.statusCode >= 400) {
                    return reject(result);
                }
                return resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    };
}

module.exports = {
    assertCatch (expected, done) {
        return e => {
            expect(e).toEqual(jasmine.objectContaining(expected));
            done();
        };
    },
    assertResponse (expected) {
        return actual => {
            expect(actual).toEqual(jasmine.objectContaining(expected));
        };
    },
    caught (done) {
        return e => {
            expect(e).toBeFalsy();
            done();
        };
    },
    request: ({
        method = 'get', port, path, body, headers = {
        'Content-Type': 'application/json'
    }
    }) => {
        return new Promise((resolve, reject) => {
            const isJson = headers['Content-Type'] === 'application/json';
            const req = http.request({
                method,
                host,
                port,
                path,
                headers,
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }, handleResponse({isJson, resolve, reject}));
            body && req.write(JSON.stringify(body));
            req.end();
        });
    }
};