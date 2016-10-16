const http = require('http');

const host = 'localhost';

module.exports = {
    assertCatch: (expected, done) => {
        return e => {
            expect(e).toEqual(expected);
            done();
        };
    },
    assertResponse: (expected) => {
        return actual => {
            expect(actual).toEqual(expected);
        };
    },
    caught: (done) => {
        return e => {
            expect(e).toBeFalsy();
            done();
        };
    },
    request: ({method = 'get', port, path, body}) => {
        return new Promise((resolve, reject) => {
            const req = http.request({
                method,
                host,
                port,
                path,
                headers: {
                    'Content-Type': 'application/json',
                },
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            }, response => {
                const chunks = []
                response.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                response.on('end', function () {
                    const joined = chunks.join();
                    try {
                        const parsed = JSON.parse(joined);
                        if (response.statusCode >= 400) {
                            return reject(parsed);
                        }
                        return resolve(parsed);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            body && req.write(JSON.stringify(body));
            req.end();
        });
    }
};