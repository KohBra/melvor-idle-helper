(() => {
    const injectScript = (src, isModule = true) => {
        let s = document.createElement('script')
        s.src = src.includes('http') ? src : chrome.extension.getURL(`js/${src}.js`)
        if (isModule) {
            s.type = 'module'
        }
        document.body.append(s)
    }

    const injectStylesheet = src => {
        let l = document.createElement('link')
        l.href = src.includes('http') ? src : chrome.extension.getURL(`css/${src}.css`)
        l.media = 'screen'
        l.rel = 'stylesheet'
        l.type = 'text/css'
        document.head.append(l)
    }

    injectScript('main')
    injectStylesheet('config')

    injectScript('https://unpkg.com/vue-multiselect@2.1.5', false)
})()