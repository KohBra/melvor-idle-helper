(() => {
    const injectScript = src => {
        let s = document.createElement('script')
        s.src = chrome.extension.getURL(`js/${src}.js`)
        s.type = 'module'
        document.body.append(s)
    }

    const injectStylesheet = src => {
        let l = document.createElement('link')
        l.href = chrome.extension.getURL(`css/${src}.css`)
        l.media = 'screen'
        l.rel = 'stylesheet'
        l.type = 'text/css'
        document.head.append(l)
    }

    injectScript('jquery.select2')
    injectScript('main')
    injectStylesheet('config')
})()