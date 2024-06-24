const {sendFile, readFileContents, sendHTML, authenticateToken, getUser} = require("../utils");
const Route = require("../route");
const {getBooks, getLikedBooks, getBookmarkedBooks, getBookStatuses} = require("../DAOs/booksDAO");
const {getPopularBooks, getTopBooks, getRecentBooks} = require("../db");

function buildList(id, name, books)
{
    let html = `createBookList("${id}", "${name}", [`;
    books.forEach(x => {
        html += `createBook("${x.book_id}", "${x.title.replaceAll("\"", "\\\"")}", "${x.author.replaceAll("\"", "\\\"")}", "${x.coverimg}", "${x.boo_rating}", "${x.boo_numratings}"),`;
    })
    html += ']),';
    return html;
}

const homeRoute = new Route('/home', 'GET', async (req, res) => {
    try
    {
        authenticateToken(req, res, async () => {
            let contents = readFileContents('./public/Pages/home.html', res);
            if (contents === null) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }

            contents = getUser(req, contents);

            let booksBuilder = "const bookLists = [";
            booksBuilder += buildList(1, "New and Popular", (await getPopularBooks()).slice(0, 20));
            booksBuilder += buildList(2, "All-Time Sellers", (await getTopBooks()).slice(0, 20));
            booksBuilder += buildList(3, "Recent releases", (await getRecentBooks()).slice(0, 20));
            booksBuilder += "];";

            contents = contents.replace("[|books|]", booksBuilder);

            sendHTML(contents, res);
        })
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = {
    homeRoute
};