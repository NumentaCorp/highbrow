const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const NeuronState = require("../../src/enums").NeuronState
const Layer = require("../../src/layer")
const Neuron = require("../../src/neuron")

describe("Neuron Unit Tests", () => {

    const config = {
        name: "layer 1",
        miniColumns: false,
        neuronCount: 1000,
        dimensions: {
            x: 10, y: 10, z: 10
        }
    }
    let layer = new Layer(config)
    let neurons = layer.getNeurons()

    describe("upon creation by Layer", () => {
        it("returns the proper cell index", () => {
            neurons.forEach((neuron, index) => {
                expect(neuron.getIndex()).to.equal(index)
            })
        })
        it("can be activated", () => {
            neurons.forEach((neuron, index) => {
                neuron._state = NeuronState.inactive
                neuron.activate()
                expect(neuron.getState()).to.equal(NeuronState.active)
            })

        })
        it("can be deactivated", () => {
            neurons.forEach((neuron, index) => {
                neuron._state = NeuronState.active
                neuron.deactivate()
                expect(neuron.getState()).to.equal(NeuronState.inactive)
            })
        })
        it("returns the correct position", () => {
            // Let's take index 0 first.
            let position = neurons[0].getPosition()
            expect(position.x).to.equal(0)
            expect(position.y).to.equal(0)
            expect(position.z).to.equal(0)
            position = neurons[1].getPosition()
            expect(position.x).to.equal(0)
            expect(position.y).to.equal(1)
            expect(position.z).to.equal(0)
            // Jump ahead out of the first mini-column.
            position = neurons[10].getPosition()
            expect(position.x).to.equal(1)
            expect(position.y).to.equal(0)
            expect(position.z).to.equal(0)
            position = neurons[11].getPosition()
            expect(position.x).to.equal(1)
            expect(position.y).to.equal(1)
            expect(position.z).to.equal(0)
            // Jump to the next mini-column.
            position = neurons[20].getPosition()
            expect(position.x).to.equal(2)
            expect(position.y).to.equal(0)
            expect(position.z).to.equal(0)
            position = neurons[21].getPosition()
            expect(position.x).to.equal(2)
            expect(position.y).to.equal(1)
            expect(position.z).to.equal(0)
        })
        it("returns the correct origin with scale applied", () => {
            let config = {
                name: "layer 1",
                miniColumns: false,
                neuronCount: 1000,
                dimensions: {
                    x: 10, y: 10, z: 10
                },
                scale: 2
            }
            let layer = new Layer(config)
            let neurons = layer.getNeurons()
            // Let's take index 0 first.
            let origin = neurons[0].getOrigin()
            expect(origin.x).to.equal(0)
            expect(origin.y).to.equal(0)
            expect(origin.z).to.equal(0)
            origin = neurons[1].getOrigin()
            expect(origin.x).to.equal(0)
            expect(origin.y).to.equal(2)
            expect(origin.z).to.equal(0)
            // Jump ahead out of the first mini-column.
            origin = neurons[10].getOrigin()
            expect(origin.x).to.equal(2)
            expect(origin.y).to.equal(0)
            expect(origin.z).to.equal(0)
            origin = neurons[11].getOrigin()
            expect(origin.x).to.equal(2)
            expect(origin.y).to.equal(2)
            expect(origin.z).to.equal(0)
            // Jump to the next mini-column.
            origin = neurons[20].getOrigin()
            expect(origin.x).to.equal(4)
            expect(origin.y).to.equal(0)
            expect(origin.z).to.equal(0)
            origin = neurons[21].getOrigin()
            expect(origin.x).to.equal(4)
            expect(origin.y).to.equal(2)
            expect(origin.z).to.equal(0)
        })
        it("returns no children", () => {
            neurons.forEach((neuron, index) => {
                expect(neuron.getChildren()).to.eql([])
            })
        })
    })

})
