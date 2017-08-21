Highbrow Requirements
=====================

Highbrow will be used to provide graphical animations of HTM systems for use within educational materials to accompany papers and videos that explain HTM technology.

## Visualization Requirements

Highbrow should display an animated view of an HTM system as it runs. The HTM state data could be read in from a batched file or streamed into Highbrow directly from a running HTM system.

## Network Configuration

An HTM Network must be defined by an configuration. This file should allow the complete configuration of a network, it's architecture, and all its components. This configuration allows the complete rendering of the network, sans neuron state. Neuron state updates will be make using a data stream (defined below).

## Data Format

Each network configuration needs a data stream to update the network. A networks data stream format is unique to Networks that share the same exact architecture. Simply speaking, one network cannot use another network's data stream.

The data format should be generic to HTM and not specific to any HTM implementation (like NuPIC). An atomic stream component would be the HTM state at any time `t`, which must at least contain:

- active cells
- active columns (if mini columns exist)
- predictive cells

### Linking Data to Configurations

Because data is particular to specific network configurations, it might be necessary to "type check" data before attempting to stream. Data files might be able to properly identify the network configurations they work with in some type of header information.

## Playback Requirements

In order to incorporate Highbrow content into video materials, scenarios must be set up where Highbrow visualizations can be run and exported into a standard movie format, preferably 1920x1080 at 30fps. Exports should either have a transparent or solid green background.

## Controls

Users must be able to move around and through the animation as it runs. Fly controls seem to be the most flexible, using the typical `WASD` for strafing and `←↑→↓` to rotate the camera. Holding `shift` should increase the speed of movement and rotation.

## Configuration Panel

A hideable control panel should provide a way to change some visualization properties of rendered components. For example, each Layer should expose a UI to change the spacing of its Neurons. A Cortical Column should allow a configuration for users to set the spacing between Layers. Etc.

## Renderable Objects

Highbrow should provide a way to visualize an HTM network in three dimensional space, including the following key renderable objects:

- Neuron
- Layer
- Cortical Column
- Network

Where the following is true:

1. All objects above are renderable objects, meaning they have an origin point and may contain renderable children (for example a Layer has an origin and Neuron children, which are also renderable).
1. All renderable object origin points are global Cartesian XYZ coordinates, not relative to any containing parent object.
1. A Neuron can be in one of many states, which may affect rendering.
1. Layers are collections of Neurons into a 3D grid, where the Y dimension indicates Mini Column structures (if they exist).
1. Layers must expose Neurons by global cell index within the Layer as well as XYZ **_position_** in the grid (_not X,Y,Z coordinate_) <small>[\*]</small>
1. Layers may contain MiniColumn structures, which should be identifiable visually. Both active columns and individual Neuron states should be visible simultaneously.
1. Cortical Columns contain one or more Layers in a list. (more details about Layer ordering coming soon)
1. A Network contains one or more Cortical Columns in a list.

> [\*] There is a one-way transform from grid position to XYZ coordinate. There is no need to transform from Cartesian XYZ coordinates into a grid position. The rendering adapters will be calling functions to transform Neurons from position into coordinate immediately upon rendering. All Neuron state access should be performed using global cell index or grid position.

## Mini-Columns

Although mini-columns are not Renderable objects (they are essentially a list of Renderable Neuron objects), client code must still be able to access these structures in order to render them with different visual aspects. Each Layer object MAY contain mini-column structures, and it should be easy to inspect for them. If a Layer contains mini-columns, Neurons within a Layer should contain an API to expose the mini-column index it exists within. This will allow client code to render neurons with the knowledge of what mini-column they are in, and whether that column is currently active.
