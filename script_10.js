// Add an event listener to the hiddenLayers input field
document.getElementById('hiddenLayers').addEventListener('change', function(event) {
    // Get the number of hidden layers from the input field
    var hiddenLayers = event.target.value;

    // Get the container for the hidden nodes input fields
    var hiddenNodesContainer = document.getElementById('hiddenNodesContainer');

    // Clear the container of any existing content
    hiddenNodesContainer.innerHTML = '';

    // Create a new input field for each hidden layer
    for (var i = 0; i < hiddenLayers; i++) {
        var div = document.createElement('div');
        div.className = 'form-group';

        var label = document.createElement('label');
        label.htmlFor = 'hiddenNodes' + (i + 1);
        label.textContent = 'Hidden Nodes ' + (i + 1) + ':';

        var input = document.createElement('input');
        input.type = 'number';
        input.id = 'hiddenNodes' + (i + 1);
        input.name = 'hiddenNodes' + (i + 1);
        input.min = '1';
        input.max = '50';
        input.className = 'nodes';

        div.appendChild(label);
        div.appendChild(input);

        hiddenNodesContainer.appendChild(div);
    }
});

// Add an event listener to the form
document.getElementById('netForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Get the number of nodes for each layer from the form inputs
    var inputNodes = document.getElementById('inputNodes').value;
    var hiddenLayers = document.getElementById('hiddenLayers').value;
    var hiddenNodes = [];
    for (var i = 0; i < hiddenLayers; i++) {
        hiddenNodes.push(document.getElementById('hiddenNodes' + (i + 1)).value);
    }
    var outputNodes = document.getElementById('outputNodes').value;

    // Call the createNet function to create the neural network visualization
    createNet(inputNodes, hiddenNodes, outputNodes);
});

function createNet(inputNodes, hiddenNodes, outputNodes) {
    // Get the container for the neural network
    var netContainer = document.getElementById('netContainer');

    // Clear the container of any existing content
    netContainer.innerHTML = '';

    // Create an array with the number of nodes in each layer
    var layers = [inputNodes, ...hiddenNodes, outputNodes];

    // Find the maximum number of nodes in any layer
    var maxNodes = Math.max(...layers);

    // Create a new SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // Set the width and height of the SVG
    svg.setAttribute('width', layers.length * 300);
    svg.setAttribute('height', maxNodes * 120 + 100);

    // Define the colors for each type of node
    var colors = ['#000039', ...new Array(hiddenNodes.length).fill('black'), 'green'];

    // Initialize an array to store the weights
    var weights = [];

    // Iterate over each layer
    for (var i = 0; i < layers.length; i++) {
        // Calculate the total height of the current layer and the offset needed to center it
        var layerHeight = layers[i] * 120;
        var offset = (maxNodes * 120 - layerHeight) / 2;

        // Iterate over each node in the current layer
        for (var j = 0; j < layers[i]; j++) {
            // Create a new circle for the node
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            // Set the position and size of the circle
            circle.setAttribute('cx', (i + 1) * 200);
            circle.setAttribute('cy', offset + (j + 1) * 120);
            circle.setAttribute('r', '30');

            // Set the color of the node based on its layer
            circle.setAttribute('fill', colors[i]);

            // Add the circle to the SVG
            svg.appendChild(circle);

            // If this is not the last layer, draw lines to the next layer
            if (i < layers.length - 1) {
                for (var k = 0; k < layers[i + 1]; k++) {
                    // Create a new line
                    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");

                    // Set the start and end points of the line
                    line.setAttribute('x1', (i + 1) * 200);
                    line.setAttribute('y1', offset + (j + 1) * 120);
                    line.setAttribute('x2', (i + 2) * 200);
                    line.setAttribute('y2', (maxNodes * 120 - layers[i + 1] * 120) / 2 + (k + 1) * 120);

                    // Set the color of the line
                    line.setAttribute('stroke', 'black');

                    // Add the line to the SVG
                    svg.appendChild(line);

                    // Assign a random weight to the connection and store it in the weights array
                    var weight = (Math.random() * (0.85 - 0.15) + 0.15).toFixed(2);
                    weights.push({
                        weight: weight,
                        node1: 'layer' + i + 'node' + j,
                        node2: 'layer' + (i + 1) + 'node' + k
                    });
                }
            }
        }
    }

    // Add the SVG to the container
    netContainer.appendChild(svg);

    // Display the weights in the console
    console.log(weights);
}


