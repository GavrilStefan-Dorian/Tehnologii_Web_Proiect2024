const Route = require("./route");
const {sendFile} = require("./utils");
const home = new Route("/", (req, res) => {
    sendFile('./Pages/home.html', res);
});

module.exports = [
    home
];