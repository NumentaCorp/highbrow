const fs = require("fs")
const assert = require("chai").assert
const expect = require("chai").expect

const testConfigs = require("./config")

const Renderable = require("../src/renderable")
const HtmNetwork = require("../src/htm-network")

/*
Basic 3D translation.
*/

// Local mock implementation.
class MockRenderable extends Renderable {

    getChildren() {
        throw new Error(
            "MockRenderable was not provided instructions for getChildren()"
        )
    }

}

describe("Renderable", () => {
    describe("upon construction", () => {
        let config = Object.assign({}, testConfigs.simple);

        it("defaults to an origin of 0,0,0", () => {
            const renderable = new MockRenderable(config)
            expect(renderable.getOrigin()).to.deep.equal({x: 0, y: 0, z: 0})
        })

        it("saves origin if constructed with one", () => {
            config.origin = {x: 1, y: 345, z: -94};
            const renderable = new MockRenderable(config)
            expect(renderable.getOrigin()).to.deep.equal({x: 1, y: 345, z: -94})
        })
    })
})
