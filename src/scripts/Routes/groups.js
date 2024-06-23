const Route = require("../route");
const {authenticateToken, requireLogin, sendFile, readFileContents, getUser, sendHTML} = require("../utils");

let viewGroupsRoute  =new Route('/view-groups', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        requireLogin(req, res, () => {
            let contents = readFileContents('./public/Pages/view-groups.html', res);
            if (contents === null) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }

            contents = getUser(req, contents);

            sendHTML(contents, res);
        });
    });
});

let groupPageRoute = new Route('/group-page', 'GET', (req, res) => {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                let contents = readFileContents('./public/Pages/group-page.html', res);
                if (contents === null) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                    return;
                }

                contents = getUser(req, contents);

                sendHTML(contents, res);
            });
        });
    });

module.exports = {
    viewGroupsRoute,
    groupPageRoute
}