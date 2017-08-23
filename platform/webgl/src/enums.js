// Highbrow
// MIT License (see LICENSE)
// Copyright © 2017 Numenta <http://numenta.com>

/**
 * All the states a neuron might be in.
 *
 * @todo Sometimes a neuron will be in more than one state at once. This either
 * needs to define mixed states or Neuron's should be allowed to be in multiple
 * states.
 */
const NeuronState = {
    inactive: "inactive",
    active: "active",
    depolarized: "depolarized",
}

/**
 * All the states a mini-column might be in.
 */
const MiniColumnState = {
    inactive: "inactive",
    active: "active",
}

/**
 * The types of links layers can have between them.
 */
const HtmLinkType = {
    apical: "apical",
    distal: "distal",
    proximal: "proximal",
}

module.exports = {NeuronState, MiniColumnState, HtmLinkType}
