import { debugLog } from './helpers.js'
import { storageKey, configKeys } from './const.js'
import * as toolDefinitions from './tools/index.js'
import configurationPage from './config.js'
import config from './config.js'

window.toolset = (() => {
    let config = {}
    let tools = {}

    const run = () => {
        loadConfig()
        startTools()
        console.log('Melvor Idle Tools loaded')
    }

    const getConfig = (key = null) => key ? config[key] ?? {} : config
    const freshConfig = () => {
        return {
            enabledTools: []
        }
    }
    const resetConfig = () => {
        config = freshConfig()
        saveConfig()
    }
    const loadConfig = () => {
        let helperConfig = localStorage.getItem(storageKey)
        if (helperConfig === null) {
            config = freshConfig()
            saveConfig()
        } else {
            config = JSON.parse(helperConfig)
        }
    }
    const setConfig = (key, value) => {
        if (key.indexOf('.')) {
            let keys = key.split('.')
            let c = config
            keys.forEach(k => {
                if (k === keys[keys.length - 1]) {
                    return c[k] = value
                }

                if (c[k] === undefined) {
                    c[k] = {}
                }
                c = c[k]
            })
        } else {
            config[key] = value
        }
        saveConfig()
    }
    const saveConfig = () => {
        localStorage.setItem(storageKey, JSON.stringify(config))
    }

    const getAvailableTools = () => toolDefinitions
    const getTools = () => tools
    const startTools = () => config[configKeys.enabledTools].forEach(toolName => startTool(toolName))
    const startTool = toolName => {
        let tool = getTool(toolName)
        tools[toolName] = tool
        if (!tool.started) {
            tool.start()
        }
    }
    const stopTool = toolName => {
        let tool = getTool(toolName)
        if (tool.started) {
            tool.stop()
        }
    }
    const restartTool = toolName => {
        let tool = getTool(toolName)
        tool.setConfig(getConfig(toolName))
        if (tool.started) {
            tool.stop()
            tool.start()
        }
    }
    const getTool = toolName => tools[toolName] ?? new toolDefinitions[toolName](getConfig(toolName))

    return {
        run,

        getConfig,
        loadConfig,
        setConfig,
        saveConfig,
        resetConfig,

        getAvailableTools,
        getTools,
        startTools,
        startTool,
        stopTool,
        restartTool,
        getTool,

        configuration: configurationPage,
    }
})()

// Run after the game has loaded what it needs.
let loadedInterval = setInterval(() => {
    if (window.isLoaded) {
        clearInterval(loadedInterval)
        toolset.run()
        configurationPage.build(toolset)
        // Get the fuck outta here with the ad container.
        $('#main-container>div:first-child').remove();
    }
}, 50)