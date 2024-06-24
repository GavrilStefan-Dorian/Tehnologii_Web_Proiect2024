const {sendFile, readFileContents, sendHTML, getUser, authenticateToken} = require("../utils");
const Route = require("../route");
const {getBooks, getCategories} = require("../DAOs/booksDAO");

const searchRoute = new Route('/search', 'GET', async (req, res) => {
    try
    {
        authenticateToken(req, res, async () => {
            try {
                let contents = readFileContents('./public/Pages/search.html', res);
                if (contents === null) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                    return;
                }

                contents = getUser(req, contents);

                const categories = await getCategories();

                let builder = "const categories = [";
                categories.forEach(x => builder += `createCategory("${x.genre_id}", "${x.name.replaceAll("'", "")}"),`)
                builder += "];";

                contents = contents.replace("[|categories|]", builder);

                sendHTML(contents, res);
            }
            catch (ex)
            {
                console.log(ex);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
        });
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = searchRoute;