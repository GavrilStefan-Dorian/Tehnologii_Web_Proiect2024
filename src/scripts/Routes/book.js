const {sendFile, readFileContents, sendHTML, processToken} = require("../utils");
const Route = require("../route");
const {getBooks, getBook, getReviews, getUserReview} = require("../DAOs/booksDAO");

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

        processToken(req, res, async () => {
            let user_id = null;
            if(req.user)
                user_id = req.user.userId;

            const user = await getUserReview(user_id, req.book);
            const book = await getBook(req.book, user_id);
            const reviews = await getReviews(req.book);

            contents = contents.replace("[|user|]", `const user=${JSON.stringify(user)};`);
            contents = contents.replace("[|book|]", `const book=${JSON.stringify(book)};`);
            contents = contents.replace("[|reviews|]", `const reviews=${JSON.stringify(reviews)};`);

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

module.exports = bookRoute;