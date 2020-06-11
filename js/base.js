import { debugLog } from './helpers.js'
import { storageKey, configKeys, exportedGameVars } from './const.js'
import * as toolDefinitions from './tools/index.js'

window.helper = (() => {
    let config = {}
    let tools = {}

    const run = () => {
        loadConfig()
        startTools()
        console.log('Melvor Idle Helper loaded')
    }

    const getConfig = () => config
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
        config[key] = value
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
        tool.start()
    }
    const stopTool = toolName => {
        let tool = getTool(toolName)
        tool.stop()
    }
    const getTool = toolName => tools[toolName] ?? new toolDefinitions[toolName]

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
        getTool,
    }
})()

// Run after the game has loaded what it needs.
let loadedInterval = setInterval(() => {
    if (window.isLoaded) {
        clearInterval(loadedInterval)
        helper.run()
    }
}, 50)