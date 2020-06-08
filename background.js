setTimeout(() => {
    setAvailableOptions()
    setOptions()
    listenForChanges()
})

const availableOptions = [
    'SmithingTimer',
    'FletchingTimer',
    'AutoBonfire',
    'AutoLooter',
]

const debug = false
const debugLog = (...logs) => debug && console.log(...logs)

function setAvailableOptions () {
    chrome.storage.sync.set({availableOptions: availableOptions})
}

function setOptions (newOptions = {}) {
    chrome.storage.sync.get(['options'], ({ options }) => {
        if (!options) {
            options = {}
        }

        // Set any new options onto the options obj
        options = Object.assign(freshOptions(), options, newOptions)

        chrome.storage.sync.set({options: options}, result => debugLog("setOptions", options, result))
    })
}

function freshOptions () {
    return availableOptions.reduce((options, option) => {
        options[option] = false
        return options
    }, {})
}

function resetOptions () {
    chrome.storage.sync.set({options: freshOptions()}, result => debugLog("options reset"))
}

function changeOption (option, value) {
    setOptions({[option]: value})
}

function listenForChanges () {
    chrome.runtime.onMessage.addListener((message, sender, respond) => {
        if (message.type === 'changeOption') {
            changeOption(message.option, message.value)
            sendChanges({option: message.option, value: message.value})
        }
        debugLog('received message', message, sender)
        respond('ok')
    })
}

function sendChanges (optionChange) {
    optionChange.type = 'optionUpdated'
    chrome.tabs.query({url: "https://melvoridle.com/*"}, (tabs) => {
        if (tabs.length !== 1) {
            return console.error('Melvor tab not found, or multiple tabs found')
        }

        chrome.tabs.sendMessage(tabs[0].id, optionChange, response => {
            debugLog('sent option change to melvor tab', optionChange, response)
        })
    })
}

