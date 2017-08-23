// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const NeuronState = require("./enums").NeuronState

/**
 * Represents a pyramidal neuron. The atomic unit of HTM computation.
 */
class Neuron extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._state = NeuronState.inactive
        if (config.position == undefined) {
            throw Error("Cannot create Neuron without position")
        }
        this._position = config.position
    }

    activate() {
        this.setState(NeuronState.active)
    }

    deactivate() {
        this.setState(NeuronState.inactive)
    }

    /**
     * The Neuron is the atomic unit of this visualization. It will always
     * return dimensions of 1,1,1.
     */
    getDimensions() {
        return {x: 1, y: 1, z: 1}
    }

    /**
     * @override NOOP
     * @returns [] empty list
     */
    getChildren() {
        return []
    }

    /**
     * @override
     */
    getName() {
        return `${this.index} (${this.state})`
    }

    /**
     * @override
     */
    toString() {
        let n = this.getName()
        let p = this.getPosition()
        let o = this.getOrigin()
        return `${n} at position [${p.x}, ${p.y}, ${p.z}], coordinate [${o.x}, ${o.y}, ${o.z}]`
    }

    setState (state)  {
        this._state = state
    }

    getState () {
        return this._state
    }

    getPosition() {
        return this._position
    }

    // This index only changes if the config changes (unlikely).
    getIndex () {
        return this.getConfig()["index"]
    }

}

module.exports = Neuron
