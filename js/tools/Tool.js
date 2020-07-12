export default class Tool
{
    constructor (config = {}) {
        this.started = false
        this.config = config
        this.stats = {}
        this.loadStats()
    }

    start () {
        this.started = true
    }

    stop () {
        this.started = false
    }

    setConfig (config) {
        this.config = config
    }

    configComponent () {
        return null
    }

    getDescription () {
        return this.constructor.name
    }

    getName () {
        return this.constructor.name
    }

    loadStats () {
        this.stats = JSON.parse(localStorage.getItem(`${this.getName()}-stats`)) ?? {}
    }

    saveStats () {
        localStorage.setItem(`${this.getName()}-stats`, JSON.stringify(this.stats))
    }

    getStat (statKey) {
        let keys = statKey.split('.')
        return keys.reduce((stats, key) => {
            if (stats === null || stats[key] === undefined) {
                return null
            }
            return stats[key]
        }, this.stats)
    }

    setStat (statKey, value) {
        let keys = statKey.split('.')
        let lastKey = keys[keys.length - 1]
        let s = this.stats

        keys.forEach(key => {
            if (s[key] === undefined && key !== lastKey) {
                s[key] = {}
            } else if (key === lastKey) {
                s[key] = value
            }
            s = s[key]
        })

        this.saveStats()
    }

    addStatValue (statKey, additional) {
        if (typeof this.getStat(statKey) !== 'number') {
            this.setStat(statKey, additional)
        } else {
            this.setStat(statKey, this.getStat(statKey) + additional)
        }
    }

    incrementStatValue (statKey) {
        if (typeof this.getStat(statKey) !== 'number') {
            this.setStat(statKey, 1)
        } else {
            this.setStat(statKey, this.getStat(statKey) + 1)
        }
    }
}