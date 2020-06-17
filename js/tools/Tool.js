export default class Tool
{
    started = false
    constructor (config = {}) {
        this.config = config
    }

    start () {
        this.started = true
    }

    stop () {
        this.started = false
    }

    getDescription () {
        return this.constructor.name
    }

    buildConfigHtml () {
        return ''
    }

    getName () {
        return this.constructor.name
    }
}