const {sendFile, readFileContents, sendHTML, authenticateToken, requireLogin} = require("../utils");
const Route = require("../route");
const {getBooks, getBook, getReviews, getUserReview, getUserReviews} = require("../DAOs/booksDAO");
const {sql} = require("../db");

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

        authenticateToken(req, res, async () => {
            let user_id = null;
            if(req.user)
                user_id = req.user.userId;

            const userReviews = await getUserReviews(user_id, req.book);
            let user = userReviews.find(x => x.book_id === req.book);
            if(!user)
                user = {
                    username: userReviews[0].username,
                    user_id: userReviews[0].user_id
                };

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

const postReviewRoute = new Route('/review', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {
                await sql`INSERT INTO reviews(user_id, book_id, rating, description, creation_date) VALUES (${req.user.userId}, ${req.body.bookId}, ${req.body.rating}, ${req.body.description}, ${Date.now()});`;
                console.log("Inserted review on " + req.body.bookId);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Ok');
            })
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
    bookRoute,
    postReviewRoute
};