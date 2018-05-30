/**
 * @file Exports three helper functions used to extend Hyper plugins with additional functionality.
 * @author Olivia Trewin <zancoproductions@gmail.com>
 */

/**
 * Register a sub-plugin that extends the functionality of another plugin.
 * @param {string} parentName - The name used by the parent plugin when asking for sub-plugins.
 * @param {Function} subPluginClass - A class that is provided to the parent plugin.
 * @param {Function?} extraCode - A callback that is executed after sub-plugin registration.
 * @returns {(window: any) => void}
 */
function registerSubPlugin (parentName: string, subPluginClass: Function, extraCode?: Function): (window: any) => void {
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

    if (extraCode instanceof Function) {
      extraCode(window)
    }
  }
}

/**
 * Register yourself as a parent plugin.
 * @param {string} pluginName - The name sub-plugins are registered under.
 * @param {Function?} onRegister - A callback executed for each sub-plugin that's registered.
 * @returns {(window: any) => void}
 */
function registerParentPlugin (pluginName: string, onRegister?: Function): (window: any) => void {
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
 * @returns {Function[]}
 */
function getSubPlugins (pluginName: string, wnd: any = window): Function[] {
  if (!wnd.hyper_plugin_extend) {
    throw new Error('No parent or sub plugins have been registered.')
  }

  if (!wnd.hyper_plugin_extend[pluginName]) {
    throw new Error('No parent or sub plugins have been registered under the requested name.')
  }

  return wnd.hyper_plugin_extend[pluginName]
}

export { registerSubPlugin, registerParentPlugin, getSubPlugins }
