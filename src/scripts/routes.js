const Route = require('./route');
const { sendFile, sendError, authenticateToken, requireLogin, validateEmail} = require('./utils');
const { getUserByEmail, insertUser, getUserById } = require('./users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./config').jwtSecret;
const formidable = require('formidable');
const generateRSSFeed = require('./rssFeed');


// const { groupsRoute,
//     createGroupRoute,
//     getGroupRoute,
//     updateGroupRoute,
//     deleteGroupRoute,} = require('./Routes/groups')

const { viewGroupsRoute } = require('./Routes/groups');



const homeRoute = require('./Routes/home');
const path = require("path");
const booksRoute = require("./Routes/books");
const {bookRoute, postReviewRoute, likeRoute, bookmarkRoute, statusRoute, downloadRoute} = require("./Routes/book");
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
        const urlParts = req.url.split('?');
        const queryString = urlParts.length > 1 ? urlParts[1] : '';
        const queryParams = new URLSearchParams(queryString);
    
        const email = queryParams.get('email');
        const password = queryParams.get('password');
    
        if (!email || !password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing email or password' }));
            return;
        }

            try {
                getUserByEmail(email, async (error, user) => {
                  if (error) {
                    console.error('Error fetching user:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                    return;
                  }
            
                  if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return;
                  }
            
                  bcrypt.compare(password, user.password, (err, result) => {
                    if (err || !result) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid credentials' }));
                        return;
                    }
            
                    const token = jwt.sign(
                      { userId: user.user_id, username: user.username, role: user.role },
                      jwtSecret,
                      { expiresIn: '1h' }
                    );
            
                    res.setHeader('Set-Cookie', [
                      `jwt=${token}; Max-Age=${60 * 60}; SameSite=Lax; Path=/`,
                      `role=${user.role}; Max-Age=${60 * 60}; SameSite=Lax; Path=/`
                    ]);
            
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful', token: token, role: user.role }));                  });
                });
              } catch (error) {
                console.error('Login error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));              }
        }),

        new Route('/register', 'POST', async (req, res) => {
            const urlParts = req.url.split('?');
            const queryString = urlParts.length > 1 ? urlParts[1] : '';
            const queryParams = new URLSearchParams(queryString);
        
            const username = queryParams.get('username');
            const email = queryParams.get('email');
            const password = queryParams.get('password');
        
            if (!username || !email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username, email, and password are required.' }));
                return;
            }
        if (!validateEmail(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid email format.' }));
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.'
            }));
            return;
        }

        const role = 'client';
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            insertUser(username, email, hashedPassword, role, result => {
                if (result.success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User registered successfully' }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Error registering user: ${result.error}` }));
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Internal server error: ${error.message}` }));
        }
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

    viewGroupsRoute,

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
    statusRoute,
    downloadRoute,

    new Route('/user', 'GET', (req, res) => {
        const urlParts = req.url.split('?');
        const queryString = urlParts.length > 1 ? urlParts[1] : '';
        const queryParams = new URLSearchParams(queryString);
    
        const userId = queryParams.get('id');
    
        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing user ID' }));
            return;
        }
    
        try {
            getUserById(userId, (error, user) => {
                if (error) {
                    console.error('Error fetching user:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                    return;
                }
    
                if (!user) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User not found' }));
                    return;
                }
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            });
        } catch (error) {
            console.error('Request error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }),

    // groupsRoute,
    // createGroupRoute,
    // getGroupRoute,
    // updateGroupRoute,
    // deleteGroupRoute,

    // groupsByUserRoute,
    // popularGroupsRoute,
];

// function sendUrl(url, res) {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ url: url }));
// }


module.exports = routes;
