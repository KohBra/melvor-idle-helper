import * as toolDefinitions from './tools/index.js'
import { configKeys, configPageId } from './const.js'
import { configGroup, configPage, toolToggle } from './htmlBuilder.js'

const iconPath = 'assets/media/main/settings_header.svg'
let tools = null
let built = false
let sortOptions = true

export default {

    itemOption (option) {
        let img = '<span class="m-1"></span>'
        if ($(option.element).data('img')) {
            img = `<img class="skill-icon-sm" src="${$(option.element).data('img')}">`
        }
        return $(`<span>${img}<span>${option.text}</span></span>`)
    },

    buildConfigPage () {
        if (built) {
            return
        }

        // Add button to access config page
        this.addConfigButton()
        let configHtml = this.toolToggles()

        Object.keys(toolDefinitions).forEach(toolName => {
            let tool = new toolDefinitions[toolName]
            let html = tool.buildConfigHtml()
            if (html.length > 0) {
                configHtml += configGroup(toolName, html)
            }
        })

        $('#main-container').append(configPage(configHtml))

        built = true
        this.addEventHandlers()
    },

    toolToggles () {
        let toolToggles = ''
        Object.keys(toolDefinitions).forEach(toolName => {
            let tool = new toolDefinitions[toolName]
            toolToggles += toolToggle(tool, toolName)
        })
        return configGroup('Toggle Tools', toolToggles)
    },

    addEventHandlers () {
        // Some dumb shit here
        // This select2 nonsense allows selected elements to be selected in a particular order,
        // but also have the dropdown always show in the same order...
        $('.item-select2').each((i, el) => {
            $(el).select2({
                templateResult: this.itemOption,
                templateSelection: this.itemOption,
                closeOnSelect: !el.multiple,
                sorter: o => sortOptions ? o.sort((a, b) => parseInt(a.id) - parseInt(b.id)) : o,
            }).on("select2:select", function (evt) {
                var element = evt.params.data.element;
                var $element = $(element);
                $element.detach();
                $(this).append($element);
                $(this).trigger("change");
            })
        })

        // Because radio buttons are incredibly dumb
        $('input[type=radio].better-radio').on('change', e => {
            let target = $(e.target).data('target')
            if (e.target.checked && target) {
                $(`input[type=hidden][name=${target}]`).val(e.target.value).change()
            }
        })
        $('input[type=hidden].better-radio').on('change', e => {
            $(`input[type=radio][data-target=${e.target.name}]`).each((i, radio) => {
                radio.checked = radio.value === e.target.value
            })
        })

        // Not as dumb of shit here
        Object.keys(toolDefinitions).forEach(toolName => {
            let configFields = $(`[name^=config-${toolName}-]`)

            configFields.on('change', e => {
                let [, toolName, configName] = e.target.name.split('-')
                let value = $(e.target).val()
                if (configName === 'toggle') {
                    this.toggleTool(toolName, parseInt(value))
                } else {
                    tools.setConfig(`${toolName}.${configName}`, value)
                    tools.restartTool(toolName)
                }
            })
        })
    },

    updateConfigPage () {
        Object.keys(toolDefinitions).forEach(toolName => {
            let enabled = tools.getConfig(configKeys.enabledTools).indexOf(toolName) >= 0
            $(`input[name=config-${toolName}-toggle]`).val(+enabled)
            $(`input[id=config-${toolName}-toggle-${enabled ? 'enable' : 'disable'}]`).attr('checked', true)

            Object.keys(tools.getConfig(toolName)).forEach(configName => {
                let field = $(`[name=config-${toolName}-${configName}]`)
                field.val(tools.getConfig(toolName)[configName])
                field.change()
            })
        })
    },

    addConfigButton () {
        let buttonContainer = $(`<div class="d-inline-block ml-2"></div>`)
        let button = $(`<button class="btn btn-sm btn-dual"><img class="skill-icon-xxs" src="${iconPath}"></button>`)
        button.on('click', () => {
            this.loadConfigPage()
        })
        $('[onclick="loadPotions();"]').parent().before(buttonContainer.html(button))
    },

    loadConfigPage () {
        $('[data-toggle="tooltip"]').tooltip('hide')
        // Hide Current container
        let page = $('#main-container>div.content:not(.d-none)')
        page.addClass('d-none')
        $(`#${configPageId}`).removeClass('d-none')
        $('#header-title').text('Tool Configuration')
        $('#header-icon').attr('src', iconPath)
        $('#header-theme').attr('class', 'content-header bg-secondary')
        $('#page-header').attr('class', ' bg-secondary');

        if (page.length > 0) {
            // watch page change to close the config page
            const ob = new MutationObserver(mutations => mutations.forEach(() => {
                $(`#${configPageId}`).addClass('d-none')
                if (ob) {
                    ob.disconnect()
                }
            })).observe(page[0], {attributes: true})
        }
    },

    toggleTool (toolName, enabled) {
        if (enabled) {
            if (tools.getConfig(configKeys.enabledTools).indexOf(toolName) < 0) {
                tools.getConfig(configKeys.enabledTools).push(toolName)
            }
            tools.startTool(toolName)
        } else {
            let toolIndex = tools.getConfig(configKeys.enabledTools).indexOf(toolName)
            if (toolIndex >= 0) {
                tools.getConfig(configKeys.enabledTools).splice(toolIndex, 1)
                tools.stopTool(toolName)
            }
        }

        tools.saveConfig()
    },

    build (toolset) {
        tools = toolset
        this.buildConfigPage()
        this.updateConfigPage()
    }
}