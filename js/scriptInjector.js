(() => {
    let s = document.createElement('script')
    s.src = chrome.extension.getURL('js/base.js')
    s.type = 'module'
    document.body.append(s)
})()