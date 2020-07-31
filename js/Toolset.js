import { configKeys, configPageId, icon, storageKey } from './const.js'
import * as toolDefinitions from './tools/index.js'
import { default as ConfigPageComponent } from './components/ConfigPage.js'
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

let instance = null

export class Toolset
{
    constructor () {
        if (instance === null) {
            instance = this
        }

        this._config = {}
        this._tools = {}
        this._app = null
        return instance
    }

    loadConfig () {
        const config = localStorage.getItem(storageKey)
        if (config === null) {
            this._config = this.freshConfig()
            this.saveConfig()
        } else {
            this._config = JSON.parse(config)
        }
    }

    saveConfig () {
        localStorage.setItem(storageKey, JSON.stringify(this._config))
    }

    freshConfig () {
        return {
            [configKeys.enabledTools]: []
        }
    }

    resetConfig () {
        this._config = this.freshConfig()
        this.saveConfig()
    }

    getConfig (key = null) {
        return key ?
            this._config[key] ?? (this._config[key] = {})
            : this._config
    }

    setConfig (key, value) {
        if (key.indexOf('.')) {
            let keys = key.split('.')
            let c = this._config
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
            this._config[key] = value
        }
        this.saveConfig()
    }

    startTools () {
        this._config[configKeys.enabledTools].forEach(toolName => {
            this.startTool(toolName)
        })
    }

    startTool (toolName) {
        let tool = this.getTool(toolName)
        this._tools[toolName] = tool
        if (!tool.started) {
            tool.start()
        }

        if (this._config[configKeys.enabledTools].indexOf(toolName) < 0) {
            this._config[configKeys.enabledTools].push(toolName)
        }
    }

    stopTool (toolName) {
        let tool = this.getTool(toolName)
        if (tool.started) {
            tool.stop()
        }

        let index = this._config[configKeys.enabledTools].indexOf(toolName)
        if (index >= 0) {
            this._config[configKeys.enabledTools].splice(index, 1)
        }
    }

    restartTool (toolName) {
        let tool = this.getTool(toolName)
        tool.setConfig(this.getConfig(toolName))
        if (tool.started) {
            tool.stop()
            tool.start()
        }
    }

    getTool (toolName) {
        return this._tools[toolName] ?? new toolDefinitions[toolName](this.getConfig(toolName))
    }

    isToolEnabled (toolName) {
        return this._config[configKeys.enabledTools].indexOf(toolName) >= 0
    }

    buildConfigPage () {
        let buttonContainer = $(`<div class="d-inline-block ml-2"></div>`)
        let button = $(`<button class="btn btn-sm btn-dual"><img class="skill-icon-xxs" src="${icon}"></button>`)
        button.on('click', () => {
            this.loadConfigPage()
        })
        $('[onclick="loadPotions();"]').parent().before(buttonContainer.html(button))
        $('#main-container').append(`<div class="content d-none" id="${configPageId}"><config-page :config="config"></config-page></div>`)

        Vue.prototype.$toolset = this
        this._app = new Vue({
            el: `#${configPageId}`,
            components: { 'config-page': ConfigPageComponent },
            data: {
                config: this._config,
                items: items,
                bank: window.bank,
            },
            watch: {
                config: {
                    deep: true,
                    handler () {
                        console.log('saving config')
                        this.$toolset.saveConfig()
                    }
                }
            }
        })
    }

    loadConfigPage () {
        // Hide Current container
        let page = $('#main-container>div.content:not(.d-none)')
        page.addClass('d-none')
        $(`#${configPageId}`).removeClass('d-none')
        $('#header-title').text('Tool Configuration')
        $('#header-icon').attr('src', icon)
        $('#header-theme').attr('class', 'content-header bg-secondary')
        $('#page-header').attr('class', ' bg-secondary')

        if (page.length > 0) {
            // watch page change to close the config page
            // using function here instead of arrow so that this.disconnect always works
            new MutationObserver(function (mutations) {
                mutations.forEach(() => {
                    $(`#${configPageId}`).addClass('d-none')
                    this.disconnect()
                })
            }).observe(page[0], { attributes: true })
        }
    }

    loaded () {
        console.info('Melvor Idle Tools loaded')
    }

    static run () {
        const toolset = new Toolset()
        toolset.loadConfig()
        toolset.buildConfigPage()
        toolset.startTools()
        toolset.loaded()
        return toolset
    }
}