class Route {
    constructor(url, method, handler) {
        this.url = url;
        this.method = method;
        this.handler = handler;
    }
}

module.exports = Route;
