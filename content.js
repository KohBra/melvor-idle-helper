setTimeout(() => {
    makePageScript()
    loadAndRunOptions()
    watchForOptionsChanges()
})

let options = {}
const debug = true
const debugLog = (...logs) => debug && console.log(...logs)

function makePageScript () {
    let s = document.createElement('script')
    s.src = chrome.extension.getURL('page.js');
    document.body.append(s);
}

function loadAndRunOptions () {
    chrome.storage.sync.get(['options'], ({ options: opts }) => {
        options = opts
        sendOptions()
    })
}

function watchForOptionsChanges () {
    chrome.runtime.onMessage.addListener((message, sender, respond) => {
        if (message.type === 'optionUpdated') {
            options[message.option] = message.value
            sendOptions()
        }
        debugLog('received message from bg', message, sender)
        respond('ok')
    })
}

function sendOptions () {
    // Send message until its confirmed received
    let id = null;
    window.addEventListener("message", event => {
        debugLog('received message from page', event)
        clearInterval(id)
    })

    id = setInterval(() => {
        window.postMessage({type: 'runHelpers', options: options}, "*")
        debugLog('options sent to page', options)
    }, 500)
}