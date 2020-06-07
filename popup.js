let options = {}
const debug = false
const debugLog = (...logs) => debug && console.log(...logs)

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['options'], ({ options: opts }) => {
        options = opts
        buildOptions()
        registerOptionListeners()
    })
}, false)

function buildOptions () {
    let optionsContainer = document.getElementById('options')
    let html = ''
    Object.keys(options).forEach(option => {
        html += `<div>${option}<input type="checkbox" id="${option}" ${options[option] ? 'checked' : ''}></div>`
    })
    optionsContainer.innerHTML = html
}

function registerOptionListeners () {
	Object.keys(options).forEach(option => {
		document.getElementById(option).addEventListener('change', function () {
            let checked = this.checked
            debugLog('option changed', option, checked, options[option])
            if (options[option] !== checked) {
                sendMessage(
                    {type: 'changeOption', option: option, value: checked},
                    () => options[option] = checked
                )
            }
        })
	})
}

function sendMessage (message, callback) {
    chrome.runtime.sendMessage(message, response => {
        callback()
        debugLog('message sent', message, response)
    })
}