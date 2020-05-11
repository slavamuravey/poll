module.exports = class {
    constructor(http, httpHost, httpPort) {
        this.http = http;
        this.httpHost = httpHost;
        this.httpPort = httpPort;
    }

    listen() {
        this.http.listen(this.httpPort, this.httpHost, () => {
            console.log(`Server running at http://${this.httpHost}:${this.httpPort}/`);
        });
    }
};