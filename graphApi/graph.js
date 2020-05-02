class Graph {

    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

    addEdge(edge) {
        if (this.containsEdge(edge)) {
            return;
        }

        this.edges.push(edge);
    }

    addVertex(vertex) {
        if (this.containsVertex(vertex)) {
            return;
        }

        this.vertices.push(vertex);
    }

    clearEdges() {
        this.edges = [];
    }

    clearVertices() {
        this.vertices = [];
        this.clearEdges();
    }

    containsEdge(edge) {
        for (let e of this.edges) {
            if (e.equals(edge)) {
                return true;
            }
        }

        return false;
    }

    containsVertex(vertex) {
        for (let v of this.vertices) {
            if (v.equals(vertex)) {
                return true;
            }
        }

        return false;
    }

    getEdge(originId, destinyId) {
        return this.getEdges(originId)
            .filter(edge => edge.destinyId == destinyId)[0];
    }

    getEdges(id) {
        return this.edges
            .filter(edge => edge.originId == id);
    }

    getEdgeIds() {
        return this.edges.map(edge => `${edge.originId}-${edge.destinyId}`);
    }
    
    getNeighbours(id) {
        return this.edges
            .filter(edge => edge.originId == id)
            .map(edge => this.getVertex(edge.destinyId));
    }

    getVertex(id) {
        return this.vertices
            .filter(vertex => vertex.id == id)[0];
    }

    getVerticesIds() {
        return this.vertices.map(vertex => vertex.id);
    }

    removeEdge(originVertexId, destinyVertexId) {
        this.edges = this.edges.filter(edge => (edge.originId != originVertexId) && (edge.destinyId != destinyVertexId));
        //this.edges = this.edges.filter(edge => edge.originId != destinyVertexId && edge.destinyId != originVertexId);
    }

    removeVertex(id) {
        this.vertices = this.vertices.filter(vertex => vertex.id != id);
    }
}
