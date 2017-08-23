// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const Renderable = require("./renderable")
/** @ignore */
const Layer = require("./layer")

/**
 * Represents a cortical column.
 */
class CorticalColumn extends Renderable {
    constructor(config, parent) {
        super(config, parent)
        this._buildColumn()
    }

    _buildColumn() {
        let columnOrigin = this.getOrigin()
        let scale = this.getScale()
        let processedLayers = []

        // Reverse the layer configuration so that they render from bottom to
        // top. slice() copies the array first so the config is not altered.
        let reversedLayers = this._config.layers.slice().reverse()
        reversedLayers.map((layerConfigOriginal, layerIndex) => {
            let layerConfig = Object.assign({}, layerConfigOriginal)
            // Only pass along the column's scale if there is no user-defined
            // scale present.
            if (layerConfig.scale == undefined) {
                layerConfig.scale = scale
            }
            layerConfig.origin = this.getOrigin()

            // Default cell spacing for layers will be 10% of scale, or 0
            if (layerConfig.spacing == undefined) {
                layerConfig.spacing = scale / 10
                if (layerConfig.spacing < 1) layerConfig.spacing = 0
            }

            // Get the total height of previously processed layers so we know
            // where to put the origin for this layer.
            let layerY = processedLayers.map((processedLayer) => {
                let ydim = processedLayer.getDimensions().y
                let cellHeight = ydim * processedLayer.getScale()
                let spacingHeight = (ydim - 1) * processedLayer.getSpacing()
                let columnSpacing = this.getSpacing()
                return cellHeight + spacingHeight + columnSpacing
            }).reduce((sum, value) => {
                return sum + value
            }, 0)

            layerConfig.origin.y = layerConfig.origin.y + layerY

            let layer = new Layer(layerConfig, this)
            processedLayers.push(layer)
            return layer
        })
        // The layers were processed in reverse order, reverse them again.
        this._layers = processedLayers.reverse()
    }

    /**
     * This function accepts HTM state data and updates the
     * positions and states of all {@link Renderable} HTM components.
     *
     * @param {Object} data - I don't know what this is going to look like yet.
     */
    update(data) {
        for (let layerConfig of this.getConfig()['layers']) {
            // console.log(layerConfig)
            let layer = this.getChildByName(layerConfig.name)
            // console.log(layer.toString())
            let layerData = data[layerConfig.name]
            let activeCellIndexes = undefined
            let activeColumnIndexes = undefined
            // Handles if only cell data is sent
            if (Array.isArray(layerData)) {
                activeCellIndexes = layerData
            } else {
                activeCellIndexes = layerData.activeCells
                activeColumnIndexes = layerData.activeColumns
            }
            layer.update(activeCellIndexes, activeColumnIndexes)
        }
    }

    /**
     * @override
     */
    getChildren() {
        return this.getLayers()
    }

    getLayers() {
        return this._layers
    }

    /**
     * @return {HtmNetworkLink[]} All the links within this column. Does not
     *         return inter-column links. You must get those from the parent.
     */
    getHtmNetworkLinks() {
        let columnLinks = this.getCorticalColumns().map((c) => {
            c.getHtmNetworkLinks()
        })
        return [].concat(...columnLinks)
    }
}

module.exports = CorticalColumn
