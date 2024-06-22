const http = require('http');
const { sendFile, isResource, getResourceRoute} = require('./scripts/utils');
const routes = require('./scripts/routes');
const {processCSV, getTopBooks, getPopularBooks} = require("./scripts/db");
const {insertUser} = require("./scripts/users");

const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);

    let route = routes.find(r => (r.url === req.url || (typeof r.url === 'function' && r.url(req))) && r.method === req.method);

    if(!route)
        route = getResourceRoute(req.url);

    if (route) {
        console.log(`Matched route: ${route.method} ${route.url}`);
        route.handler(req, res);
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
