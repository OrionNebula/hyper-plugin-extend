/**
 * @file Exports three helper functions used to extend Hyper plugins with additional functionality.
 * @author Olivia Trewin <zancoproductions@gmail.com>
 */

export interface PluginConstructor {
  new (...args: any[]): any
}

/**
 * Register a sub-plugin that extends the functionality of another plugin.
 * @param {string} parentName - The name used by the parent plugin when asking for sub-plugins.
 * @param {PluginConstructor} subPluginClass - A class that is provided to the parent plugin.
 * @param {(window: Window) => void?} extraCode - A callback that is executed after sub-plugin registration.
 * @returns {(window: Window) => void}
 */
export function registerSubPlugin (parentName: string, subPluginClass: PluginConstructor, extraCode?: (window: Window) => void): (window: any) => void {
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
 * @param {(PluginClass: PluginConstructor) => void?} onRegister - A callback executed for each sub-plugin that's registered.
 * @returns {(window: Window) => void}
 */
export function registerParentPlugin (pluginName: string, onRegister?: (PluginClass: PluginConstructor) => void): (window: any) => void {
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
 * @returns {PluginConstructor[]}
 */
export function getSubPlugins (pluginName: string, wnd: any = window): PluginConstructor[] {
  if (!wnd.hyper_plugin_extend) {
    throw new Error('No parent or sub plugins have been registered.')
  }

  if (!wnd.hyper_plugin_extend[pluginName]) {
    throw new Error('No parent or sub plugins have been registered under the requested name.')
  }

  return wnd.hyper_plugin_extend[pluginName]
}
