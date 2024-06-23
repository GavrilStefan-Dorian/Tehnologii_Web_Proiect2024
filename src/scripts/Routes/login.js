const Route = require("../route");
const {sendFile, sendError, authenticateToken, getUser, readFileContents, sendHTML} = require("../utils");
const {getUserByEmail, insertUser} = require("../users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

let loginRoute = new Route('/login', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/login.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
});

let registerRoute = new Route('/register', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/register.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
});

let postLoginRoute = new Route('/login', 'POST', (req, res) => {
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
});

let postRegisterRoute = new Route('/register', 'POST', async (req, res) => {
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
    });

let forgotPassRoute = new Route('/forgot-pass', 'GET', (req, res) => {
    authenticateToken(req, res, () => {
        let contents = readFileContents('./public/Pages/forgot-pass.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
    })
    });

module.exports = {
    loginRoute,
    registerRoute,
    postRegisterRoute,
    postLoginRoute,
    forgotPassRoute
}