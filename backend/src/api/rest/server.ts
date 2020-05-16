export default class {
    constructor(
        private http: any,
        private readonly httpHost: any,
        private readonly httpPort: any
    ) {
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