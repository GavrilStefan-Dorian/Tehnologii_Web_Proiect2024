const fs = require("fs");
const path = require("path");
const Route = require("./route");

function readFileContents(url)
{
    if (!fs.existsSync(url) || !fs.lstatSync(url).isFile()) {
        return null;
    }

    return fs.readFileSync(url, 'utf8');
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

module.exports = {
    sendFile,
    readFileContents,
    sendHTML,
    getResourceRoute
}
