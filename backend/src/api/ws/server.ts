export default class {
    constructor(
        private io: any,
        private readonly wsPort: any
    ) {
        this.io = io;
        this.wsPort = wsPort;
    }

    listen() {
        this.io.listen(this.wsPort);
    }
};