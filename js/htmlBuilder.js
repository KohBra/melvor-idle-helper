import { configPageId } from './const.js'
import { getBankItem } from './helpers.js'


// Generic config builders
export const configPage = configHtml => `
<div class="content d-none" id="${configPageId}">
    <div class="row row-deck">
        <div class="col-md-12">
            <div class="block block-rounded block-link-pop border-top border-settings border-4x">
                <div class="block-content">
                    ${configHtml}
                </div>
            </div>
        </div>
    </div>
</div>
`

export const configGroup = (name, innerHtml) =>
    `<h2 class="content-heading border-bottom mb-4 pb-2">${name}</h2><div class="row">${innerHtml}</div>`

export const configItemDescription = (name, description = '') => `
<div class="col-6 col-lg-4">
    <p 
        class="font-size-sm text-muted 
        ${description.length ? `
        js-tooltip-enabled"
        data-toggle="tooltip" 
        data-html="true"
        data-placement="bottom" 
        title=""
        data-original-title="${description}"
        ` : '"'}
    >
        ${name}
    </p>
</div>
`

export const configItemForm = innerHtml => `
<div class="col-6 col-lg-8">
    <div class="form-group">
        ${innerHtml}
    </div>
</div>`

export const toolConfigInputName = (toolName, configName) => `config-${toolName}-${configName}`


// Config inputs
export const toolToggle = (tool, toolName) =>
    configItemDescription(toolName, tool.getDescription()) +
    configItemForm(toggleInput(toolName, 'toggle'))

export const toggleInput = (toolName, configName) => `
<input type="hidden" class="better-radio" name="${toolConfigInputName(toolName, configName)}">
<div class="custom-control custom-radio custom-control-inline custom-control-lg">
    <input 
        type="radio" 
        class="custom-control-input better-radio" 
        id="${toolConfigInputName(toolName, `${configName}-enable`)}" 
        data-target="${toolConfigInputName(toolName, configName)}"
        value="1"
    >
    <label class="custom-control-label" for="${toolConfigInputName(toolName, `${configName}-enable`)}">
        Enabled
    </label>
</div>
<div class="custom-control custom-radio custom-control-inline custom-control-lg">
    <input
        type="radio" 
        class="custom-control-input better-radio" 
        id="${toolConfigInputName(toolName, `${configName}-disable`)}" 
        data-target="${toolConfigInputName(toolName, configName)}"
        value="0"
    >
    <label class="custom-control-label" for="${toolConfigInputName(toolName, `${configName}-disable`)}">
        Disabled
    </label>
</div>
`

export const itemSelect = (itemIds, name, multiple = false) => select2(itemIds.map(itemId => {
    let bankItem = getBankItem(itemId)
    if (!itemId) {
        return {
            img: null,
            id: '',
            text: 'None',
        }
    } else {
        return {
            img: items[itemId].media,
            id: itemId,
            text: `${items[itemId].name} (${bankItem ? bankItem.qty : 0})`,
        }
    }
}), name, multiple)

// Will not keep value order.
export const select2 = (options, name, multiple = false) => `
<select class="item-select2" name="${name}" ${multiple ? 'multiple' : ''}>
    ${options.reduce((html, option) => {
        html += `<option value="${option.id}" ${option.img ? `data-img="${option.img}"` : ''}>${option.text}</option>`
        return html
    }, '')}
</select>
`

export const selectField = (options, name) => `
<select class="form-control" name="${name}">
    ${options.reduce((html, option) => html += `<option value="${option.id}">${option.text}</option>`, '')}
</select>
`

export const numberField = (name, defaultValue, min = 1, max = 100) =>
    `<input class="form-control" name="${name}" type="number" ${defaultValue ? `value="${defaultValue}"` : ''} min="${min}" max="${max}">`

// Info builders
export const genericInfoContainer = (imgSrc, title, text, subtext, classList, skill) => `${infoContainer(`
<div class="media d-flex align-items-center push">
    <div class="mr-3">
        <img class="shop-img" src="${imgSrc}">
    </div>
    <div class="media-body">
        <div class="font-w600">${title}</div>
            <div class="font-size-sm">${text}</div>
        <div class="font-size-sm text-success" id="harvest-ready-0">${subtext}</div>
    </div>
</div>
`, classList, skill)}`

export const infoContainer = (innerHtml, classList = 'col-12 col-md-6 col-xl-4', skill = 'settings') => `
<div class="${classList}">
    <div class="block block-content block-rounded block-link-pop border-top border-${skill} border-4x d-flex">
        ${innerHtml}
    </div>
</div>
`