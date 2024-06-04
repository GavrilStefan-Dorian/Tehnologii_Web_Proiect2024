const http = require('http');
const path = require('path');
const fs = require('fs');
const { sendFile } = require('./scripts/utils');

const hostname = '127.0.0.1';
const port = 3000;

const routes = require('./scripts/routes');

const formidable = require('formidable');
const { getUsers, insertUser } = require('./scripts/users');

const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);

    if (req.method === 'GET' && req.url === '/users') {
        console.log('Fetching users...');

        getUsers((error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
        });
    } else if (req.method === 'POST' && req.url === '/register') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields) => {
            if (err) {
                console.error('Error parsing form data:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const { username, email, password } = fields;

            console.log('Received registration data:');
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);

            insertUser(username, email, password, (result) => {
                if (result.success) {
                    res.writeHead(302, { 'Location': '/home.html' });
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error registering user');
                }
                res.end();
            });
        });
    } else {
        const route = req.url;

        // Check if the route matches any defined routes
        let foundRoute = false;
        routes.forEach((x) => {
            if (x.url === route) {
                x.action(req, res);
                foundRoute = true;
            }
        });

        // If no specific route found, attempt to serve file
        if (!foundRoute) {
            sendFile(route, res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
