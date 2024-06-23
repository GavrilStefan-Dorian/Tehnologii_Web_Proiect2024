const {sendFile, readFileContents, sendHTML, getUserBookData, authenticateToken, requireLogin} = require("../utils");
const Route = require("../route");
const {getBooks, getBookStatuses, getBooksWithStatuses} = require("../DAOs/booksDAO");

function buildList(name, books)
{
    let html = `createBookList("${name}", [`;
    books.forEach(x => {
        html += `createBook("${x.book_id}", "${x.title}", "${x.author}", "${x.coverimg}", "${x.rating}", "${x.numratings}"),`;
    })
    html += ']),';
    return html;
}

const booksRoute = new Route('/books', 'GET', async (req, res) => {
    try
    {
        let contents = readFileContents('./public/Pages/books.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {
                const books = await getBooksWithStatuses(req.user.userId);

                let booksBuilder = "const bookLists = [";
                booksBuilder += buildList("To Read", books.filter(x => x.status === "to_read"));
                booksBuilder += buildList("Reading", books.filter(x => x.status === "reading"));
                booksBuilder += buildList("Finished", books.filter(x => x.status === "read"));
                booksBuilder += "];";

                contents = contents.replace("[|books|]", booksBuilder);

                sendHTML(contents, res);
            })
        });
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = booksRoute;