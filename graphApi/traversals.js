const dfsTraversal = (graph, startingVertexId) => {
    let visitedVertexIds = [];
    let traversal = [];

    dfsTraversalHelper(graph, startingVertexId, visitedVertexIds, traversal);

    return traversal;
}

const dfsTraversalHelper = (graph, vertexId, visitedNodeIds, traversal) => { 
    if (visitedNodeIds.indexOf(vertexId) == -1) {
        traversal.push(graph.getVertex(vertexId));
        visitedNodeIds.push(vertexId);

        graph.getNeighbours(vertexId).forEach(vertex => {
            dfsTraversalHelper(graph, vertex.id, visitedNodeIds, traversal);
        });
    }
}

const bfsTraversal = (graph, startingVertexId) => {
    let visitedNodeIds = [];
    let queue = [];
    let traversal = [];

    traversal.push(graph.getVertex(startingVertexId));
    visitedNodeIds.push(startingVertexId);

    bfsTraversalHelper(graph, startingVertexId, visitedNodeIds, queue, traversal);

    return traversal;
}

const bfsTraversalHelper = (graph, vertexId, visitedNodeIds, queue, traversal) => {
    graph.getNeighbours(vertexId).forEach(vertex => {
        if (visitedNodeIds.indexOf(vertex.id) == -1) {
            visitedNodeIds.push(vertex.id);
            traversal.push(vertex);
            queue.push(vertex);
        }
    });

    if (queue.length != 0) {
        let newVertex = queue.shift();
        bfsTraversalHelper(graph, newVertex.id, visitedNodeIds, queue, traversal);
    }
}
