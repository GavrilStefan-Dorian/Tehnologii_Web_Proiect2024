const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const routes  = require("./scripts/routes");
const path = require("path");
const fs = require("fs");
const {sendFile} = require("./scripts/utils");

const server = http.createServer((req, res) => {
    const route = req.url;

    routes.forEach((x) => {
        if(x.url === route)
        {
            x.action(req, res);
        }
    });

    if(sendFile(route, res))
        return;
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});