// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")

/**
 * Represents data flow between {@link Layer}s.
 */
class HtmNetworkLink extends Renderable {
    /**
     * @param {Layer} to - Where link data originates.
     * @param {Layer} from - Where link data terminates.
     * @param {HtmLinkType} type - Type of link.
     */
    constructor(config, parent, from, to, type) {
        super(config, parent)
        this._from = from
        this._to = to
        this._type = type
    }

    getOrigin() {
        throw new Error("Not implemented")
    }

    /**
     * @override noop, has no children.
     */
    getChildren() {
        return []
    }

    /**
     * @return {Layer} Where the link data originates.
     */
    getFrom() {
        return this.getParent()
    }

    /**
     * @return {Layer} Where the link data terminates.
     */
    getTo() {
        return this.getChildren()[0]
    }

}

module.exports = HtmNetworkLink
