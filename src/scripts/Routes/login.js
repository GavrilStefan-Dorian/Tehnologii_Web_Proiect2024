const Route = require("../route");
const {sendError, authenticateToken, getUser, readFileContents, sendHTML, validateEmail} = require("../utils");
const {getUserByEmail, insertUser} = require("../users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

const loginRoute = new Route('/login', 'GET', (req, res) =>
{
    authenticateToken(req, res, () => {
        try {
            let contents = readFileContents('./public/Pages/login.html', res);
            if (contents === null) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }

            contents = getUser(req, contents);

            sendHTML(contents, res);
        }
        catch (ex)
        {
            console.log(ex);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    });
});

const registerRoute = new Route('/register', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        try {
            let contents = readFileContents('./public/Pages/register.html', res);
            if (contents === null) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }

            contents = getUser(req, contents);

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

const postLoginRoute = new Route('/login', 'POST', (req, res) => {
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

            if (user.banned) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User banned' }));
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
});

const postRegisterRoute = new Route('/register', 'POST', async (req, res) => {
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
});

const forgotPassRoute = new Route('/forgot-pass', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        try {
            let contents = readFileContents('./public/Pages/forgot-pass.html', res);
            if (contents === null) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }

            contents = getUser(req, contents);

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

module.exports = {
    loginRoute,
    registerRoute,
    postRegisterRoute,
    postLoginRoute,
    forgotPassRoute
}