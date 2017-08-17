// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const CorticalColumn = require("./cortical-column")

/**
 * Encapsulates all {@link Renderable} HTM components in the network.
 */
class HtmNetwork extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._corticalColumns = this._config.corticalColumns.map((config) => {
            // Attach the same origin as the parent, but a clone.
            config.origin = Object.assign({}, this.getOrigin())
            // use the same scale as well
            config.scale = this.getScale()
            return new CorticalColumn(config, this)
        })
    }

    /**
     * This function accepts HTM state data and updates the positions and states
     * of all {@link Renderable} HTM components.
     * @param {Object} data - I don't know what this is going to look like yet.
     */
    update(data) {
        for (let columnConfig of this.getConfig()['corticalColumns']) {
            // console.log(columnConfig)
            let column = this.getChildByName(columnConfig.name)
            // console.log(column.toString())
            let columnData = data[columnConfig.name]
            column.update(columnData)
        }
    }

    /**
     * Provides access to all {@link CorticalColumn} children.
     * @override
     * @return {CorticalColumn[]} Cortical columns.
     */
    getChildren() {
        return this.getCorticalColumns()
    }

    /**
     * @return {CorticalColumn[]} Cortical columns.
     */
    getCorticalColumns() {
        return this._corticalColumns
    }

    /**
     * @return {HtmNetworkLink[]} All the links in the whole network.
     */
    getHtmNetworkLinks() {
        let columnLinks = this.getCorticalColumns().map((c) => {
            c.getHtmNetworkLinks()
        })
        return [].concat(...columnLinks)
    }

}

module.exports = HtmNetwork
