// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/** @ignore */
const CONFIG_DEFAULTS = {
    scale: 1,
    spacing: 0,
}

/**
 * Abstract base class for renderable objects. All renderable objects must
 * provide the following function implementations:
 * - {@link getChildren}
 *
 * NOTE: The size of {@link Renderable} objects is not controlled by this API.
 * Clients of this API are responsible for sizing.
 */
class Renderable {
    /**
     * @param {Object} config - Contains all the details the Renderable needs to
     *        know to calculate origins for itself and its children.
     * @param {float} config.scale - Scale of this renderable object.
     * @param {Renderable} parent - The parent Renderable object (optional).
     * @param {number} scale - Default 1.0, used for UI clients to scale the
     *        drawings.
     */
    constructor(config, parent = undefined) {
        // Clone the config so we don't change it in case it is reused somewhere
        // else.
        this._config = Object.assign({}, config)
        this._parent = parent
        this._scale = this._getConfigValueOrDefault("scale")
        this._origin = this._getConfigValueOrDefault("origin")
        this._spacing = this._getConfigValueOrDefault("spacing")
    }

    // Utility for overridding default values and throwing error if no value
    // exists.
    _getConfigValueOrDefault(name) {
        let out = CONFIG_DEFAULTS[name]
        if (this._config.hasOwnProperty(name)) {
            out = this._config[name]
        }
        if (out == undefined) {
            throw new Error("Cannot create Renderable without " + name)
        }
        return out
    }

    // Utility for apply this object's scale to any xyz point.
    _applyScale(point) {
        let scale = this.getScale()
        return {
            x: point.x * scale,
            y: point.y * scale,
            z: point.z * scale,
        }
    }

    /**
     * @return {Object} Configuration object used to create this.
     */
    getConfig() {
        return this._config
    }

    getDimensions() {
        throw new Error(
            "Renderable Highbrow objects must provide getDimensions()"
        )
    }

    /**
     * Point of origin for this {@link Renderable} to be drawn in 3D.
     *
     * @return {Object} point with 3D coordinates
     * @property {number} x x coordinate
     * @property {number} y y coordinate
     * @property {number} z z coordinate
     */
    getOrigin() {
        // Returns a copy or else someone could inadvertantly change the origin.
        return Object.assign({}, this._origin)
    }

    /**
     * Changing the scale of of a {@link Renderable} will affect the origins of
     * children. Use {@link setOffset} with this function to reposition this
     * {@link Renderable}'s children.
     */
    setScale(scale) {
        this._scale = scale
        if (this.getChildren().length) {
            this.getChildren().forEach(child => { child.setScale(scale)})
        }
    }

    /**
     * @return {number} scale See {@link setScale}.
     */
    getScale() {
        return this._scale
    }

    getSpacing() {
        return this._spacing
    }

    /**
     * @return {string} The name of this object.
     */
    getName() {
        return this._config.name
    }

    getParent() {
        return this._parent
    }

    /**
     * How subclasses provide access to their {@link Renderable} children.
     *
     * @abstract
     * @return {Renderable[]} children
     */
    getChildren() {
        throw new Error(
            "Renderable Highbrow objects must provide getChildren()"
        )
    }

    getChildByName(name) {
        return this.getChildren().find(child => child.getName() == name)
    }


    toString(verbose = false) {
        let out = `${this.constructor.name} ${this.getName()}`
        let children = this.getChildren()
        if (children.length) {
            for (let child of children) {
                out += "\t" + child.toString(verbose).split("\n")
                                   .map(s => "\n\t" + s)
                                   .join("")
            }
        }
        return out
    }

}

module.exports = Renderable
