const http = require('http');
const { sendFile } = require('./scripts/utils');
const routes = require('./scripts/routes'); 

const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);

    const route = routes.find(r => r.url === req.url && r.method === req.method);

    if (route) {
        console.log(`Matched route: ${route.method} ${route.url}`);
        route.handler(req, res);
    } else {
        console.log(`No matching route found for ${req.method} ${req.url}`);
        sendFile(req.url, res);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
