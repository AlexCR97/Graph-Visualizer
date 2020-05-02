class Vertex {
    constructor(id, xpos, ypos) {
        this.id = id;
        this.xpos = xpos;
        this.ypos = ypos;
    }

    equals(other) {
        return this.id == other.id;
    }
}
