/**
 * Register a sub-plugin that extends the functionality of another plugin.
 * @param {string} parentName - The name used by the parent plugin when asking for sub-plugins.
 * @param {Function} subPluginClass - A class that is provided to the parent plugin.
 * @param {Function} extraCode - A callback that is executed after sub-plugin registration.
 */
function registerSubPlugin (parentName, subPluginClass, extraCode) {
  return function (window) {
    if (!window.hyper_plugin_extend) {
      window.hyper_plugin_extend = {}
    }

    if (!window.hyper_plugin_extend[parentName]) {
      window.hyper_plugin_extend[parentName] = []
    }

    window.hyper_plugin_extend[parentName].push(subPluginClass)

    if (window.hyper_plugin_extend.onRegister) {
      window.hyper_plugin_extend.onRegister(subPluginClass)
    }

    if (extraCode) {
      extraCode(window)
    }
  }
}

/**
 * Register yourself as a parent plugin.
 * @param {string} pluginName - The name sub-plugins are registered under.
 * @param {Function} onRegister - A callback executed for each sub-plugin that's registered.
 */
function registerParentPlugin (pluginName, onRegister) {
  return function (window) {
    if (!window.hyper_plugin_extend) {
      window.hyper_plugin_extend = {}
    }

    if (!window.hyper_plugin_extend[pluginName]) {
      window.hyper_plugin_extend[pluginName] = []
    }

    if (onRegister instanceof Function) {
      window.hyper_plugin_extend[pluginName].forEach(onRegister)

      window.hyper_plugin_extend.onRegister = onRegister
    }
  }
}

/**
 * Get all sub-plugins registered under the specified name.
 * @param {string} pluginName - All plugins under this name are retrieved.
 * @param {Window?} wnd - A reference to window.
 */
function getSubPlugins (pluginName, wnd = window) {
  if (!wnd.hyper_plugin_extend) {
    throw new Error('No parent or sub plugins have been registered.')
  }

  if (!wnd.hyper_plugin_extend[pluginName]) {
    return new Error('No parent or sub plugins have been registered under the requested name.')
  }

  return wnd.hyper_plugin_extend[pluginName]
}

export { registerSubPlugin, registerParentPlugin, getSubPlugins }
