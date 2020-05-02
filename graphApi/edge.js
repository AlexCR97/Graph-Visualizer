class Edge {
    constructor(originId, destinyId) {
        this.originId = originId;
        this.destinyId = destinyId;
    }

    equals(other) {
        return this.originId == other.originId && this.destinyId == other.destinyId;
    }
}
