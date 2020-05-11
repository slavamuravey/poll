module.exports = class {
    constructor(io, wsPort) {
        this.io = io;
        this.wsPort = wsPort;
    }

    listen() {
        this.io.listen(this.wsPort);
    }
};