# hyper-plugin-extend

Allows hyper plugins to integrate with each other.

## Usage

Place the following in the main JavaScript file for each sub-plugin:

```js
var registerSubPlugin = require('hyper-plugin-extend').registerSubPlugin;
var SomePluginClass = require('./somePluginClass.js').SomePluginClass;
exports.onRendererWindow = registerSubPlugin('<SOME PLUGIN NAME>', SomePluginClass, /* Optionally, you can place a callback here that is executed after plugin registration. */);
```

Place the following in the main JavaScript file for the parent plugin:

```js
var registerParentPlugin = require('hyper-plugin-extend').registerParentPlugin;
exports.onRendererWindow = registerParentPlugin('<SOME PLUGIN NAME>', PluginClass => { /* do something */ })
```

To access a list of all loaded sub-plugins later, do the following:

```js
var getSubPlugins = require('hyper-plugin-extend').getSubPlugins
getSubPlugins('<SOME PLUGIN NAME>', /* You can pass in the renderer window here. Otherwise, it's assumed to be 'window' in the global scope. */) // This returns an array of plugin classes
```

`getSubPlugins` relies on the renderer window.
