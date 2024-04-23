const fs = require("fs");
const path = require("path");

function sendFile(file, res)
{
    const filePath = path.join(__dirname, './../public/', file);
    if(!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile())
    {
        res.statusCode = 500;
        res.end();
        return false;
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
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
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    res.writeHead(200, { 'Content-Type': contentType});
    const html = fs.readFileSync(filePath);
    res.end(html);

    return true;
}

module.exports = {
    sendFile
}