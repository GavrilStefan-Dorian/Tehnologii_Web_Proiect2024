const Route = require('./route');
const { sendFile, sendError, authenticateToken, requireLogin} = require('./utils');
const { getUserByEmail, insertUser } = require('./users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./config').jwtSecret;
const formidable = require('formidable');
const generateRSSFeed = require('./rssFeed');


const homeRoute = require('./Routes/home');
const path = require("path");
const booksRoute = require("./Routes/books");
const {bookRoute, postReviewRoute, likeRoute, bookmarkRoute, statusRoute} = require("./Routes/book");
const searchRoute = require("./Routes/search");
const viewBooksRoute = require("./Routes/view_books");


const { resetGetRoute, resetPostRoute, contactPostRoute, forgotPostRoute} = require('./Routes/send_email');

function restrictToAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Forbidden: Admin access required');
    }
    next();
}

const routes = [
    new Route('/', homeRoute.method, homeRoute.handler),

    homeRoute,

    new Route('/login', 'GET', (req, res) => {
        sendFile('./Pages/login.html', res);
    }),

    new Route('/register', 'GET', (req, res) => {
        sendFile('./Pages/register.html', res);
    }),

    new Route('/login', 'POST', (req, res) => {
        const { email, password } = req.body;

            if (!email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing email or password' }));
                return;
            }

            getUserByEmail(email, async (error, user) => {
                if (error) {
                    console.error('Error fetching user:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                } else {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.error('Error comparing passwords:', err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal server error' }));
                        } else if (!result) {
                            console.log('Passwords do not match');
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Invalid credentials' }));
                        } else {
                            const token = jwt.sign({ userId: user.user_id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });

                            res.setHeader('Set-Cookie', [
                                `jwt=${token}; Max-Age=${60 * 60}; SameSite=Lax; Path=/`,
                                `role=${user.role}; Max-Age=${60 * 60}; SameSite=Lax; Path=/`
                              ]);

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login successful', token: token , role: user.role}));
                        }
                    });                    
                }
            });
        }),

    new Route('/register', 'POST', async (req, res) => {
        const { username, email, password } = req.body;
        const role = 'client';
        const hashedPassword = await bcrypt.hash(password, 10);

        insertUser(username, email, hashedPassword, role, result => {
            if (result.success) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User registered successfully' }));
            } else {
                sendError(res, 400, `Error registering user: ${result.error}`);
            }
        });
    }),

    resetGetRoute,
    
    resetPostRoute,

    forgotPostRoute,

    contactPostRoute,

    new Route('/forgot-pass', 'GET', (req, res) => {
        sendFile('./Pages/forgot-pass.html', res);
    }),

    new Route('/help', 'GET', (req, res) => {
        sendFile('./Pages/help.html', res);
    }),

    new Route('/contact', 'GET', (req, res) => {
        sendFile('./Pages/contact.html', res);
    }),

    new Route('/about', 'GET', (req, res) => {
        sendFile('./Pages/about.html', res);
    }),

    bookRoute,

    booksRoute,

    new Route('/group-page', 'GET', (req, res) => {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                sendFile('./Pages/group-page.html', res);
            });
        });
    }),

    searchRoute,

    viewBooksRoute,

    new Route('/view-groups', 'GET', (req, res) => {
        authenticateToken(req, res, () => {
            requireLogin(req, res, () => {
                sendFile('./Pages/view-groups.html', res);
            });
        });
    }),

    new Route('/admin', 'GET', (req, res) => {
        authenticateToken(req, res, () => {
            restrictToAdmin(req, res, () => {
                sendFile('./Pages/admin.html', res);
            });
        });
    }),
    new Route('/rssFeed', 'GET', async (req, res) => {
        const rssContent = await generateRSSFeed();
        res.writeHead(200, { 'Content-Type': 'application/rss+xml' });
        res.end(rssContent);
    }),
    // Add other routes
    postReviewRoute,
    likeRoute,
    bookmarkRoute,
    statusRoute
];

// function sendUrl(url, res) {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ url: url }));
// }


module.exports = routes;
