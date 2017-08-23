const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect

const Highbrow = require("../src/highbrow")
const HtmNetwork = require("../src/htm-network")
const CorticalColumn = require("../src/cortical-column")
const Layer = require("../src/layer")
const Enums = require("../src/enums")
const NeuronState = Enums.NeuronState

const testConfigs = require("./config")

/*
These are functional tests that build out the network structure and test the
links between them.
*/


// Build a simple network and type check its components.
describe("Highbrow network factory object model", () => {
    describe("when creating a one column one layer Network", () => {
        let network = Highbrow.createHtmNetwork(testConfigs.simple)
        it("returns an HtmNetwork object", () => {
            expect(network).to.be.instanceOf(HtmNetwork)
        })

        describe("HtmNetwork", () => {
            let columnTester = (columns) => {
                expect(columns).to.be.an('array').that.has.lengthOf(1)
                let column = columns[0]
                expect(column).to.be.instanceOf(CorticalColumn)
                expect(column.getName()).to.equal("column 1")
            }
            it("exposes CorticalColumns through getCorticalColumns", () => {
                columnTester(network.getCorticalColumns())
            })
            it("exposes CorticalColumns through getChildren", () => {
                columnTester(network.getChildren())
            })


            describe("CorticalColumn", () => {
                let column = network.getChildren()[0]
                let layerTester = (layers) => {
                    expect(layers).to.be.an('array').that.has.lengthOf(1)
                    let layer = layers[0]
                    expect(layer).to.be.instanceOf(Layer)
                    expect(layer.getName()).to.equal("layer 1")
                }
                it("exposes Layers through getLayers", () => {
                    layerTester(column.getLayers())
                })
                it("exposes Layers through getChildren", () => {
                    layerTester(column.getChildren())
                })
            })
        })
    })
})

// Tests the data update flow.
describe("simple network data update", () => {
    let network = Highbrow.createHtmNetwork(testConfigs.simple)
    let originalColumns = network._corticalColumns

    describe("HtmNetwork", () => {
        it("calls update on CorticalColumn with column data", () => {
            let timesCalled = 0
            let mockColumn = {
                update: (data) => {
                    timesCalled++
                    expect(data).to.deep.equal({"layer1":"mockLayerData"})
                },
                getName: () => "column 1"
            }
            // Injecting mock column.
            network._corticalColumns = [mockColumn]
            const mockData = {"column 1":{"layer1":"mockLayerData"}}
            network.update(mockData)
            expect(timesCalled).to.equal(1)
            // Replacing mock column (do no harm).
            network._corticalColumns = originalColumns
        })
    })

    describe("CorticalColumn", () => {
        let column = network.getChildren()[0]
        let originalLayers = column.getLayers()
        it("calls update on Layer with active cells", () => {
            let timesCalled = 0
            let mockLayer = {
                update: (activeCells, activeColumns) => {
                    timesCalled++
                    expect(activeCells).to.equal("mockActiveCells")
                    expect(activeColumns).to.equal(undefined)
                },
                getName: () => "layer 1"
            }
            column._layers = [mockLayer]
            const mockData = {"layer 1":{"activeCells": "mockActiveCells"}}
            column.update(mockData)
            expect(timesCalled).to.equal(1)
            column._layers = originalLayers
        })
    })

    describe("Layer", () => {
        let layer = network.getChildren()[0].getChildren()[0]

        it("updates active cell Neuron states", () => {
            const activeCells = [0,10,20,30]
            layer.update(activeCells)
            for (const [index, neuron] of layer.getNeurons().entries()) {
                let expectedState = activeCells.includes(index) ?
                                    NeuronState.active : NeuronState.inactive
                expect(neuron.getState()).to.equal(expectedState)
            }
        })
    })
})
