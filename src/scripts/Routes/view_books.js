const {sendFile, readFileContents, sendHTML} = require("../utils");
const Route = require("../route");
const {getBooks, getCategories, getCategoryBooks, getCategory} = require("../DAOs/booksDAO");

const viewBooksRoute = new Route((req) => {
    const params = req.url.split('/');
    if(params[1] !== "view_books")
        return false;
    if(params.length !== 3)
        return false;
    req.category = params[2];
    return true;
}, 'GET', async (req, res) => {
    try
    {
        let contents = readFileContents('./public/Pages/view_books.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        const books = await getCategoryBooks(req.category);
        let builder = `const books=${JSON.stringify(books)}`;

        contents = contents.replace("[|title|]", `const title="${(await getCategory(req.category)).name.replaceAll("'", "")}";`);
        contents = contents.replace("[|books|]", builder);

        sendHTML(contents, res);
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = viewBooksRoute;