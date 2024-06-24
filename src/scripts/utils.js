const fs = require("fs");
const path = require("path");
const Route = require("./route");
const {getLikedBooks, getBookmarkedBooks, getBookStatuses, getUserReviews} = require("./DAOs/booksDAO");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./config");

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

function readFileContents(url)
{
    if (!fs.existsSync(url) || !fs.lstatSync(url).isFile()) {
        return null;
    }

    return fs.readFileSync(url, 'utf8');
}

function sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
}

function sendFile(url, res) {
    const fileName = path.basename(url.split('?')[0]);

    let filePath;

    const extname = path.extname(fileName);
    switch (extname) {
        case '.html':
            filePath = path.join(process.cwd(), './public/Pages', fileName);
            break;
        case '.css':
            filePath = path.join(process.cwd(), './public/Styling', fileName);
            break;
        case '.js':
            filePath = path.join(process.cwd(), './public/JavaScript', fileName);
            break;
        case '.png':
        case '.jpg':
        case '.avif':
            filePath = path.join(process.cwd(), './public/Resources/Images', fileName);
            break;
        case '.svg':
            filePath = path.join(process.cwd(), './public/Resources/Svg', fileName);
            break;
        default:
            // For unknown file types, return 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');

            return false;
    }

    // if (path.extname(fileName) === '.html') {
    //     filePath = path.join(__dirname, '../public/Pages', fileName);
    // } else {
    //     filePath = path.join(__dirname, '../public', fileName);
    // }

    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
    
        return false;
    }

    let contentType = 'text/html';
    switch (path.extname(filePath)) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        
    }

    res.writeHead(200, { 'Content-Type': contentType });
    const fileContent = fs.readFileSync(filePath);
    res.end(fileContent);


    return true;
}

function sendHTML(contents, res) {
    let contentType = 'text/html';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(contents);
}

function getResourceRoute(url)
{
    if (!fs.existsSync(url) || !fs.lstatSync(url).isFile()) {
        return null;
    }

    const extname = path.extname(url);
    switch (extname) {
        case '.html':
        case '.css':
        case '.js':
        case '.png':
        case '.jpg':
        case '.avif':
        case '.svg':
            return new Route(url, 'GET', (req, res) => {
                sendFile(url, res);
            });
        default:
            return null;
    }
}

function isResource(url)
{
    const extname = path.extname(url);
    switch (extname) {
        case '.html':
        case '.css':
        case '.js':
        case '.png':
        case '.jpg':
        case '.avif':
        case '.svg':
            return true;
        default:
            return false;
    }
}

async function getUserBookData(req, contents)
{
    let likedBooks = [];
    let bookmarkedBooks = [];
    let bookStatuses = [];

    if(req.user)
    {
        likedBooks = await getLikedBooks(req.user.user_id);
        bookmarkedBooks = await getBookmarkedBooks(req.user.user_id);
        bookStatuses = await getBookStatuses(req.user.user_id);
    }

    contents = contents.replace("[|likedBooks|]", `const likedBooks=${JSON.stringify(likedBooks)}`);
    contents = contents.replace("[|bookmarkedBooks|]", `const bookmarkedBooks=${JSON.stringify(bookmarkedBooks)}`);
    contents = contents.replace("[|bookStatuses|]", `const bookStatuses=${JSON.stringify(bookStatuses)}`);

    return contents;
}

function authenticateToken(req, res, next) {
    if(!req.headers.cookie)
    {
        next();
        return;
    }

    const params = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
    if(!params)
    {
        next();
        return;
    }

    const token = params.split('=')[1];
    if (!token) {
        next();
        return;
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            next();
            return;
        }

        req.user = decoded;

        if(req.user.banned)
        {
            sendError(res, 403, "User banned");
            return;
        }

        next();
    });
}

function requireLogin(req, res, next) {
    if (!req.user) {
        let contents = readFileContents('./public/Pages/login.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        sendHTML(contents, res);
        return;
    }
    next();
}

function getUser(req, contents) {
    if(req.user)
    {
        contents = contents.replace("[|user|]", `const user=${JSON.stringify(req.user)}`);
    }
    else contents = contents.replace("[|user|]", `const user=null`);

    return contents;
}

module.exports = {
    sendError,
    sendFile,
    readFileContents,
    sendHTML,
    getResourceRoute,
    isResource,
    getUserBookData,
    authenticateToken,
    requireLogin,
    getUser,
    validateEmail
}
