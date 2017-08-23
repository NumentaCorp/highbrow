// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const NeuronState = require("./enums").NeuronState
/** @ignore */
const MiniColumnState = require("./enums").MiniColumnState
/** @ignore */
const HtmLinkType = require("./enums").HtmLinkType
/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const HtmNetwork = require("./htm-network")
/** @ignore */
const HtmNetworkLink = require("./links").HtmNetworkLink

/**
 * This is the top-level static entry class for Highbrow.
 */
class Highbrow {

    /**
     * Creates a new {@link HtmNetwork} with the given configuration.
     * @param {Object} config
     */
    static createHtmNetwork(config) {
        return new HtmNetwork(config)
    }

    /**
     * @return {@link NeuronState}
     */
    static getNeuronStates() {
        return NeuronState
    }

    /**
     * @return {@link MiniColumnState}
     */
    static getMiniColumnStates() {
        return MiniColumnState
    }

    /**
     * @return {@link HtmLinkType}
     */
    static getHtmLinkTypes() {
        return HtmLinkType
    }
}
if (typeof window === 'undefined') {
    module.exports = Highbrow
} else {
    window.Highbrow = Highbrow
}
