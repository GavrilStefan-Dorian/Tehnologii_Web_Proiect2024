const {sendFile, readFileContents, sendHTML} = require("../utils");
const Route = require("../route");
const {getBooks, getBook, getReviews} = require("../DAOs/booksDAO");

const bookRoute = new Route((req) => {
    const params = req.url.split('/');
    if(params[1] !== "book")
        return false;
    if(params.length !== 3)
        return false;
    req.book = params[2];
    return true;
}, 'GET', async (req, res) => {
    try
    {
        let contents = readFileContents('./public/Pages/book.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        const book = await getBook(req.book);
        const reviews = await getReviews(req.book);

        contents = contents.replace("[|book|]", `const book=${JSON.stringify(book)};`);
        contents = contents.replace("[|reviews|]", `const reviews=${JSON.stringify(reviews)};`);

        sendHTML(contents, res);
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = bookRoute;