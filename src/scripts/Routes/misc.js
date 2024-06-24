const Route = require("../route");
const {sendFile, authenticateToken, readFileContents, getUser, sendHTML, sendError} = require("../utils");

let helpRoute = new Route('/help', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/help.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
});

let contactRoute = new Route('/contact', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/contact.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
});

let aboutRoute = new Route('/about', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/about.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
});

let adminRoute = new Route('/admin', 'GET', (req, res) => {
        authenticateToken(req, res, () => {
            restrictToAdmin(req, res, () => {
                authenticateToken(req, res, () => {
                    let contents = readFileContents('./public/Pages/admin.html', res);
                    if (contents === null) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                        return;
                    }

                    contents = getUser(req, contents);

                    sendHTML(contents, res);
                })
            });
        });
    });

function restrictToAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Forbidden: Admin access required');
    }
    next();
}

module.exports = {
    helpRoute,
    contactRoute,
    aboutRoute,
    adminRoute
}