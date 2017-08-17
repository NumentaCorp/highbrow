const assert = require("chai").assert
const expect = require("chai").expect

const CorticalColumn = require("../../src/cortical-column")

describe("CorticalColumn Unit Tests", () => {

    describe("upon construction", () => {
        let config = {
            name: "column 1",
            origin: {x: 1, y: 345, z: -94},
            scale: 44,
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
        }
        const column = new CorticalColumn(config)
        const layer = column.getLayers()[0]
        it("creates the first layer at the same origin as itself", () => {
            expect(layer.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
        it("creates the first layer with the same scale as itself", () => {
            expect(layer.getScale()).to.deep.equal(44)
        })
    })

    describe("when scale is applied upon construction", () => {
        let config = {
            name: "column 1",
            origin: {x: 1, y: 345, z: -94},
            scale: 2.2,
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
        }
        const column = new CorticalColumn(config)
        const layer = column.getLayers()[0]
        it("does not scale its own origin", () => {
            expect(column.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
        it("does not scale the layer's origin", () => {
            expect(layer.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })

    describe("when constructing a 2-layer column", () => {
        let config = {
            scale: 1,
            spacing: 0,
            origin: {x:0, y:0, z:0},
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
        }
        describe("without scale or spacing", () => {
            const column = new CorticalColumn(config)
            it("creates the second layer at the same origin as itself", () => {
                let layer = column.getLayers()[1]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
            })
            it("creates the first layer directly above the second layer", () => {
                let layer = column.getLayers()[0]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 10, z: 0})
            })
        })
        describe("with spacing and scale", () => {
            let cfg = Object.assign({}, config);
            cfg.scale = 100
            cfg.spacing = 50
            cfg.layers[1].spacing = 10
            const column = new CorticalColumn(cfg)
            it("creates the second layer at the same origin as itself", () => {
                let layer = column.getLayers()[1]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
            })
            it("creates the first layer directly above the second layer", () => {
                let layer = column.getLayers()[0]
                let bottomLayerHeight = 10 * 100 + 9 * 10;
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: bottomLayerHeight + 50, z: 0})
            })
        })
    })

    describe("when constructing a 3-layer column", () => {
        let config = {
            origin: {x:0, y:0, z:0},
            scale: 1,
            spacing: 0,
            name: "3-layer column",
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
        }

        describe("with layer spacing of 0", () => {
            let column = new CorticalColumn(config)
            it("creates the third layer at the same origin as itself", () => {
                let layer = column.getLayers()[2]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
            })
            it("creates the second layer above the third layer with one empty position between", () => {
                let layer = column.getLayers()[1]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 6, z: 0})
            })
            it("creates the first layer above the second layer with one empty position between", () => {
                let layer = column.getLayers()[0]
                expect(layer.getOrigin()).to.deep.equal({x: 0, y: 11, z: 0})
            })
        })

        describe("with layer spacing of 1", () => {
            let cfg = Object.assign({}, config)
            cfg.origin = {x: 0, y: 0, z: 0}
            cfg.scale = 1
            cfg.spacing = 1
            let col = new CorticalColumn(cfg)
            console.log(JSON.stringify(col._config, null, 2))
            it("third layer is at origin", () => {
                expect(col.getLayers()[2].getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
            })
            it("second layer is 1 space above third", () => {
                expect(col.getLayers()[1].getOrigin()).to.deep.equal({x: 0, y: 7, z: 0})
            })
            it("first layer is 1 space above second", () => {
                expect(col.getLayers()[0].getOrigin()).to.deep.equal({x: 0, y: 13, z: 0})
            })
        })
    })

})
