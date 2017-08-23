// Simple network configuration. One column, one layer, no mini-columns.
const simple = {
    name: "simple network",
    origin: {x: 0, y: 0, z: 0},
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }
        ]
    }]
}

const oneColTwoLayers = {
    name: "one column, two layers",
    origin: {x: 0, y: 0, z: 0},
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 10, z: 10
                }
            },
            {
                name: "layer 2",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 10, z: 10
                }
            }
        ]
    }]
}
const oneColThreeLayers = {
    name: "one column, three layers",
    origin: {x: 0, y: 0, z: 0},
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 4, z: 10
                }
            },
            {
                name: "layer 2",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 5, z: 10
                }
            },
            {
                name: "layer 3",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 6, z: 10
                }
            }
        ]
    }]
}
// Complex network with multiple columns and layers, includes mini-columns.
const complex = {
    name: "simple network",
    origin: {x: 0, y: 0, z: 0},
    corticalColumns: [{
        name: "column 1",
        layers: [
            {
                name: "layer 1-1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }, {
                name: "layer 1-2",
                miniColumns: true,
                neuronCount: 4096,
                dimensions: {
                    x: 30, y: 35, z: 4
                }
            }
        ]
    }, {
        name: "column 2",
        layers: [
            {
                name: "layer 2-1",
                miniColumns: false,
                neuronCount: 100,
                dimensions: {
                    x: 10, y: 10, z: 1
                }
            }, {
                name: "layer 2-2",
                miniColumns: true,
                neuronCount: 4096,
                dimensions: {
                    x: 30, y: 35, z: 4
                }
            }
        ]
    }]
}

module.exports = {simple, oneColTwoLayers, oneColThreeLayers, complex}
