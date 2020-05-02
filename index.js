// An enum used to control user mouse events
const Action = {
    AddVertex: 'Add vertex',
    AddEdge: 'Add edge',
    RemoveVertex:'Remove vertex',
    RemoveEdge: 'Remove edge',
}

let action = Action.AddVertex; // the action the user wants to do
let graph = new Graph([], []); // the graph to be displayed
let lastVertexId = 'A';        // the id used to add a new vertex
let edgeOriginId;              // the id of the origin vertex to add an edge
let edgeDestinyId;             // the id if the destiny vertex to add an edge

$(document).ready(() => {
    console.log('Document is ready!');

    initDOM();
});

// INITIALIZATION

const initDOM = () => {
    console.log('Initializing DOM');

    $('#btnAddVertex').on('click', () => {
        console.log('btnAddVertex on click');
        action = Action.AddVertex;
        console.log('action = ' + action);
    });

    $('#btnAddEdge').on('click', () => {
        console.log('btnAddEdge on click');
        action = Action.AddEdge;
        console.log('action = ' + action);
    });

    $('#btnRemoveVertex').on('click', () => {
        console.log('btnRemoveVertex on click');
        action = Action.RemoveVertex;
        console.log('action = ' + action);
    });

    $('#btnRemoveEdge').on('click', () => {
        console.log('btnRemoveEdge on click');
        action = Action.RemoveEdge;
        console.log('action = ' + action);
    });

    $('#btnClear').on('click', () => onBtnClearClick());

    $('#btnDfs').on('click', () => onBtnDfsClick());
    $('#btnBfs').on('click', () => onBtnBfsClick());

    $('#graphContainer').on('click', ($event) => onGraphContainerClick($event));
}

// EVENT LISTENERS

const onBtnClearClick = () => {
    console.log('btnClear on click');

    // Remove all edges and vertices from DOM
    graph.getEdgeIds().forEach(edgeId => $(`#${edgeId}`).remove());
    graph.getVerticesIds().forEach(vertexId => $(`#${vertexId}`).remove());

    // Remove all edges and vertices from graph
    graph.clearEdges();
    graph.clearVertices();
}

const onBtnDfsClick = () => {
    console.log('onBtnDfsClick()');

    let traversal = dfsTraversal(graph, graph.getVerticesIds()[0]);
    let traversalIds = traversal.map(vertex => vertex.id);
    let result = traversalIds.join(', ');

    console.log('Traversal is: ' + traversal);
    console.log('Result is: ' + result);

    $('#dfsResult').text(result);
}

const onBtnBfsClick = () => {
    console.log('onBtnBfsClick()');

    let traversal = bfsTraversal(graph, graph.getVerticesIds()[0]);
    let traversalIds = traversal.map(vertex => vertex.id);
    let result = traversalIds.join(', ');

    console.log('Traversal is: ' + traversal);
    console.log('Result is: ' + result);

    $('#bfsResult').text(result);
}

const onEdgeClick = (edgeId) => {
    console.log('onEdgeClick(edgeId)');
    console.log('Clicked edge was: ' + edgeId);

    switch (action) {

        // Remove edge
        case Action.RemoveEdge: {
            // TODO remove edge
            let vertexIds = edgeId.split('-');
            let originVertexId = vertexIds[0];
            let destinyVertexId = vertexIds[1];

            // remove edge from graph and DOM
            graph.removeEdge(originVertexId, destinyVertexId);
            $(`#${edgeId}`).remove();

            console.log(graph);

            break;
        }
    }
}

const onGraphContainerClick = ($event) => {
    console.log('onGraphContainerClick()');

    // get vertex id and mouse position
    let pagePosX = event.pageX;
    let pagePosY = event.pageY;
    let parentPosX = $('#graphContainer').offset().left;
    let parentPosY = $('#graphContainer').offset().top;

    let xpos = pagePosX - parentPosX;
    let ypos = pagePosY - parentPosY;

    switch (action) {

        // Add vertex
        case Action.AddVertex: {

            // TODO Check if position isn't overlapping other vertex's position

            // Add vertex to graph and DOM
            let vertex = new Vertex(lastVertexId, xpos, ypos);
            let vertexDOM = createVertexForDOM(vertex)

            graph.addVertex(vertex);
            $('#graphContainer').append(vertexDOM);

            // Update id for next vertex
            lastVertexId = nextChar(lastVertexId);

            console.log(graph);

            break;
        }
    }
}

const onVertexClick = (vertexId) => {
    console.log('onVertexClick(vertexId)');
    console.log('Clicked vertex was: ' + vertexId);
    
    switch (action) {

        // Add edge
        case Action.AddEdge: {

            console.log('Adding edge...');

            // Set vertex origin id
            if (edgeOriginId == undefined) {
                edgeOriginId = vertexId;
                console.log('No origin id set. Setting ' + edgeOriginId);
            }

            // Set vertex destiny id
            else if (edgeDestinyId == undefined) {
                edgeDestinyId = vertexId;
                console.log('No destiny id set. Setting ' + edgeDestinyId);

                // Add the edge to graph and DOM
                console.log(`Both vertex ids set: ${edgeOriginId}-${edgeDestinyId}`);

                let edge = new Edge(edgeOriginId, edgeDestinyId);
                let edgeDOM = createEdgeForDOM(edge);

                graph.addEdge(edge);
                $('#graphContainer').append(edgeDOM);

                // Reset edge vertices ids
                edgeOriginId = undefined;
                edgeDestinyId = undefined;

                console.log('Edge added!');
                console.log(graph);
            }

            break;
        }
        
        // Remove vertex
        case Action.RemoveVertex: {

            console.log('Removing vertex...');

            // Remove vertex from graph and DOM, and update id for next vertex

            graph.removeVertex(vertexId);
            $(`#${vertexId}`).remove();

            lastVertexId = prevChar(vertexId);

            console.log(graph);

            // TODO remove edges related to this vertex
            let edgesWithOriginId = graph.edges.filter(edge => edge.originId == vertexId);
            let edgesWithDestinyId = graph.edges.filter(edge => edge.destinyId == vertexId);

            let originIds = edgesWithOriginId.map(edge => `${edge.originId}-${edge.destinyId}`);
            let destinyIds = edgesWithDestinyId.map(edge => `${edge.originId}-${edge.destinyId}`);

            // Remove edges from DOM
            originIds.forEach(edgeId => $(`#${edgeId}`).remove());
            destinyIds.forEach(edgeId => $(`#${edgeId}`).remove());

            // Remove edges from graph
            edgesWithOriginId.forEach(edge => graph.removeEdge(edge.originId, edge.destinyId));
            edgesWithDestinyId.forEach(edge => graph.removeEdge(edge.originId, edge.destinyId));

            console.log(graph);

            break;
        }
    }
}

// HELPER FUNCTIONS

const createEdgeForDOM = (edge) => {
    let edgeId = `${edge.originId}-${edge.destinyId}`;
    let originVertex = graph.getVertex(edge.originId);
    let destinyVertex = graph.getVertex(edge.destinyId);

    let x1 = originVertex.xpos;
    let y1 = originVertex.ypos;
    let x2 = destinyVertex.xpos;
    let y2 = destinyVertex.ypos;

    // distance
    let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    let thickness = 8;
    let color = 'black';

    // center
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (thickness / 2);

    // angle
    let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

    // make line
    //return "<div id='" + edgeId + "' class='edge' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";

    return $("<div id='" + edgeId + "' class='edge' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />")
        .on('click', () => onEdgeClick(edgeId));
}

const createVertexForDOM = (vertex) => {
    return $('<div></div>')
        .attr('id', vertex.id)
        .text(vertex.id)
        .addClass('vertex m-0')
        .css({
            left: vertex.xpos - 25,
            top: vertex.ypos - 25,
            position: 'absolute',
        })
        .on('click', () => onVertexClick(vertex.id));
}

const nextChar = (char) => {
    let charCode = char.charCodeAt(0);
    return String.fromCharCode(charCode + 1);
}

const prevChar = (char) => {
    let charCode = char.charCodeAt(0);
    return String.fromCharCode(charCode - 1);
}
