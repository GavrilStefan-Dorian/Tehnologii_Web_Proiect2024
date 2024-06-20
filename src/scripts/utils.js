const fs = require("fs");
const path = require("path");

function sendFile(url, res) {
    const fileName = path.basename(url.split('?')[0]);

    let filePath;

    const extname = path.extname(fileName);
    switch (extname) {
        case '.html':
            filePath = path.join(__dirname, '../public/Pages', fileName);
            break;
        case '.css':
            filePath = path.join(__dirname, '../public/Styling', fileName);
            break;
        case '.js':
            filePath = path.join(__dirname, '../public/JavaScript', fileName);
            break;
        case '.png':
        case '.jpg':
        case '.avif':
            filePath = path.join(__dirname, '../public/Resources/Images', fileName);
            break;
        case '.svg':
            filePath = path.join(__dirname, '../public/Resources/Svg', fileName);
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

    console.log(url);
    console.log(fileName);
    console.log(filePath);
    console.log();

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




module.exports = {
    sendFile
}
