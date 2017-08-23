const assert = require("chai").assert
const expect = require("chai").expect
const testConfigs = require("../config")

const Renderable = require("../../src/renderable")

// class MockRenderable extends Renderable {
//     getChildren() {
//         [{
//             getOrigin: () => {x:2, y:2, z:2}
//         }, {
//             getOrigin: () => {x:20, y:20, z:23}
//         }]
//     }
// }

describe("Renderable Unit Tests", () => {
    describe("upon construction", () => {
        it("origin is not affected by scale", () => {
            let r = new Renderable({origin: {x:2, y:2, z:2}, scale: 2.0})
            expect(r.getOrigin()).to.deep.equal({x:2, y:2, z:2})
        })
        it("throws exception if no origin is provided", () => {
            expect(() => new Renderable({})).to.throw('Cannot create Renderable without origin')
        })
    })

})
