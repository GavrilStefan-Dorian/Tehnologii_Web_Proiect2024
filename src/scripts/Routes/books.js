const {sendFile, readFileContents, sendHTML, getUserBookData, authenticateToken, requireLogin, getUser} = require("../utils");
const Route = require("../route");
const {getBooks, getBookStatuses, getBooksWithStatuses, getLikedBooks, getLikedBooksFull, getBookmarkedBooksFull} = require("../DAOs/booksDAO");

function buildList(name, books)
{
    let html = `createBookList("${name}", [`;
    books.forEach(x => {
        html += `createBook("${x.book_id}", "${x.title}", "${x.author}", "${x.coverimg}", "${x.boo_rating}", "${x.boo_numratings}"),`;
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
                try {
                    contents = getUser(req, contents);

                    contents = contents.replace("[|siderbarIndex|]", 1);

                    const books = await getBooksWithStatuses(req.user.userId);

                    let booksBuilder = "const bookLists = [";
                    booksBuilder += buildList("To Read", books.filter(x => x.status === "to_read"));
                    booksBuilder += buildList("Reading", books.filter(x => x.status === "reading"));
                    booksBuilder += buildList("Finished", books.filter(x => x.status === "read"));
                    booksBuilder += "];";

                    contents = contents.replace("[|books|]", booksBuilder);

                    sendHTML(contents, res);
                }
                catch (ex)
                {
                    console.log(ex);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
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

const likedRoute = new Route('/liked', 'GET', async (req, res) => {
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
                try {
                    contents = getUser(req, contents);

                    contents = contents.replace("[|siderbarIndex|]", 3);

                    const books = await getLikedBooksFull(req.user.userId);

                    let booksBuilder = "const bookLists = [";
                    booksBuilder += buildList("Liked Books", books);
                    booksBuilder += "];";

                    contents = contents.replace("[|books|]", booksBuilder);

                    sendHTML(contents, res);
                }
                catch (ex)
                {
                    console.log(ex);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
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

const bookmarkedRoute = new Route('/bookmarked', 'GET', async (req, res) => {
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
                try {
                    contents = getUser(req, contents);

                    contents = contents.replace("[|siderbarIndex|]", 4);

                    const books = await getBookmarkedBooksFull(req.user.userId);

                    let booksBuilder = "const bookLists = [";
                    booksBuilder += buildList("Bookmarked Books", books);
                    booksBuilder += "];";

                    contents = contents.replace("[|books|]", booksBuilder);

                    sendHTML(contents, res);
                }
                catch (ex)
                {
                    console.log(ex);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
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

module.exports = {
    booksRoute,
    likedRoute,
    bookmarkedRoute
};