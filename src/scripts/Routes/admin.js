const Route = require("../route");
const {authenticateToken, requireLogin} = require("../utils");
const {sql, insertBook} = require("../db");
const {restrictToAdmin} = require("./misc");

const postBook = new Route('/book', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                restrictToAdmin(req, res, async () => {
                    await insertBook(
                        req.body.bookId,
                        req.body.title,
                        "",
                        req.body.author,
                        0,
                        req.body.description,
                        "",
                        "",
                        req.body.genres.replaceAll(" ", "").split(','),
                        "",
                        "",
                        0,
                        "",
                        new Date(req.body.publishdate).toLocaleDateString('en-US', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit'
                        }),
                        0,
                        req.body.coverimg,
                        0,
                    );
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Ok');
                })
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

const deleteBookRoute = new Route('/book', 'DELETE', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                restrictToAdmin(req, res, async () => {
                    await sql`DELETE FROM books WHERE book_id=${req.body.bookId}`;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Ok');
                })
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

const banUserRoute = new Route('/ban', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                restrictToAdmin(req, res, async () => {
                    await sql`UPDATE users SET banned = ${true} WHERE email = ${req.body.user}`;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Ok');
                })
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

const addGroupRoute = new Route('/add_group', 'POST', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                restrictToAdmin(req, res, async () => {
                    await sql`INSERT INTO groups(name, description, creation_date, img) VALUES (${req.body.name}, ${req.body.description}, ${Date.now()}, ${req.body.image})`;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Ok');
                })
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

const deleteGroupRoute = new Route('/group', 'DELETE', async (req, res) => {
    try
    {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                restrictToAdmin(req, res, async () => {
                    await sql`DELETE FROM groups WHERE group_id=${req.body.group_id}`;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Ok');
                })
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
    postBook,
    deleteBookRoute,
    banUserRoute,
    addGroupRoute,
    deleteGroupRoute
}