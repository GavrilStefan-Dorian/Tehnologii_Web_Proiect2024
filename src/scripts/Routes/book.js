const {sendFile, readFileContents, sendHTML, authenticateToken, requireLogin} = require("../utils");
const Route = require("../route");
const {getBooks, getBook, getReviews, getUserReview, getUserReviews} = require("../DAOs/booksDAO");
const {sql, extractBookReviewsCSV, extractBookReviewsXML, extractBookReviewsDBK} = require("../db");

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

            const userReviews = user_id ? await getUserReviews(user_id, req.book) : null;
            let user = userReviews ? userReviews.find(x => x.book_id === req.book) : null;
            if(!user && userReviews)
                user = {
                    username: userReviews[0].username,
                    userId: userReviews[0].user_id
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
                await sql`INSERT INTO reviews(user_id, book_id, rating, description, creation_date) VALUES (${req.user.userId}, ${req.body.bookId}, ${req.body.rating}, ${req.body.description}, ${Date.now()}) ON CONFLICT (user_id, book_id) DO UPDATE SET description = ${req.body.description}, rating = ${req.body.rating}, creation_date = ${Date.now()}, updated = ${true};`;
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

const likeRoute = new Route('/like', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {
                if(req.body.status)
                {
                    await sql`INSERT INTO liked_books(user_id, book_id) VALUES (${req.user.userId}, ${req.body.bookId})`;
                }
                else
                {
                    await sql`DELETE FROM liked_books WHERE user_id = ${req.user.userId} AND book_id = ${req.body.bookId}`;
                }
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

const bookmarkRoute = new Route('/bookmark', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {
                if(req.body.status)
                {
                    await sql`INSERT INTO bookmarked_books(user_id, book_id) VALUES (${req.user.userId}, ${req.body.bookId})`;
                }
                else
                {
                    await sql`DELETE FROM bookmarked_books WHERE user_id = ${req.user.userId} AND book_id = ${req.body.bookId}`;
                }
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

const statusRoute = new Route('/status', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {

                await sql`INSERT INTO book_reading_status(user_id, book_id, status) VALUES (${req.user.userId}, ${req.body.bookId}, ${req.body.status}) ON CONFLICT (user_id, book_id) DO UPDATE SET status = ${req.body.status}`;

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

const downloadRoute = new Route('/download', 'POST', async (req, res) => {
    try
    {
        switch(req.body.format)
        {
            case "csv":
            {
                const result = await extractBookReviewsCSV(req.body.bookId);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result[0].get_book_reviews_csv);
                break;
            }

            case "xml":
            {
                const result = await extractBookReviewsXML(req.body.bookId);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result[0].get_book_reviews_xml);
                break;
            }

            case "dbk":
            {
                const result = await extractBookReviewsDBK(req.body.bookId);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result[0].get_book_reviews_dbk);
                break;
            }
        }
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
    postReviewRoute,
    likeRoute,
    bookmarkRoute,
    statusRoute,
    downloadRoute
};