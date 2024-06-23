const http = require('http');
const { sendFile, isResource, getResourceRoute} = require('./scripts/utils');
const routes = require('./scripts/routes');
const {processCSV, getTopBooks, getPopularBooks} = require("./scripts/db");
const {insertUser} = require("./scripts/users");

const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    
    let trimmedUrl = new URL(req.url, `http://${req.headers.host}`).pathname;
    console.log(trimmedUrl);

    // console.log(req.headers);
    let route = routes.find(r => (r.url === trimmedUrl || (typeof r.url === 'function' && r.url(req))) && r.method === req.method);

    if(!route)
        route = getResourceRoute(req.url);

    if (route) {
        console.log(`Matched route: ${route.method} ${route.url}`);
        let body = "";

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                if(body)
                {
                    const parsedBody = JSON.parse(body);
                    req.body = parsedBody;
                    // console.log(parsedBody);
                }

                route.handler(req, res);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });

        req.on('error', (err) => {
            console.error('Error receiving data:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        });
    } else {
        console.log(`No matching route found for ${req.method} ${req.url}`);
        sendFile(req.url, res);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
   //await processCSV("./resources/books.csv");

    console.log("Calculating top books...");
    await getTopBooks();
    console.log("Calculating popular books...");
    await getPopularBooks();
    console.log(`Server running on port ${PORT}`);
});