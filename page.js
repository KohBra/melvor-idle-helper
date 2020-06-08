setTimeout(() => {
    listenForMessages()
})

let options = {}
let runningHelpers = {}
const debug = false
const debugLog = (...logs) => debug && console.log(...logs)

function listenForMessages () {
    window.addEventListener("message", event => {
        debugLog('got message', event)
        if (event.data.type === 'runHelpers') {
            options = event.data.options
            runHelpers()
        }
    })
}

function runHelpers () {
    Object.keys(options).forEach(option => {
        if (options[option]) {
            runHelper(option)
        } else {
            stopHelper(option)
        }
    })
}

function runHelper (option) {
    runningHelpers[option] = createHelper(option)
    runningHelpers[option].start()
}

function stopHelper (option) {
    if (runningHelpers[option]) {
        runningHelpers[option].stop()
    }
}

function createHelper (className) {
    if (typeof helpers[className] === "undefined") {
        throw new Error(`Invalid helper name: ${className}`)
    }

    return new helpers[className]
}

class Helper
{
    start () {
        throw new Error('Implement start()')
    }

    stop () {
        throw new Error('Implement end()')
    }
}

class SmithingTimer extends Helper
{
    #rowHtml = `<div class="col-12" id="koh-smithing-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-smithing"><small class="mr-2">Will Take:</small><span id="koh-smithing-time-remaining"></span></div></div>`
    #timeId = '#koh-smithing-time-remaining'
    #updateInterval = 200
    #intervalId = null

    start () {
        this.updateTime()
        this.#intervalId = setInterval(() => this.updateTime(), this.#updateInterval)
    }

    stop () {
        $('#koh-smithing-time-row').remove()
        clearInterval(this.#intervalId)
    }

    updateTime () {
        let reqs = $('#smith-item-reqs').text().trim().split(' ')

        let minTime = reqs.map((req, i) => {
            let have = $(`#smithing-item-have-${i}`).text().trim().replace(',', '')
            return {req: req, have: have, processes: have / req}
        }).reduce((min, info) => {
            if (min > info.processes) {
                min = info.processes
            }
            return min
        }, Infinity) * (smithInterval / 1000)

        let time = `${(minTime / 60).toFixed(2)}m`

        let chance = this.getKeepChance()
        if (chance) {
            let avgPotentialExtra = minTime * (chance / 100)
            time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
        }

        this.getTimeElement().text(time)
    }

    getKeepChance () {
        // Yikes
        if (smithingMastery !== undefined &&
            smithingItems !== undefined &&
            selectedSmith !== undefined &&
            smithingItems[selectedSmith] !== undefined &&
            smithingMastery[smithingItems[selectedSmith].smithingID] !== undefined
        ) {
            return Math.floor(smithingMastery[smithingItems[selectedSmith].smithingID].mastery / 20) * 10
        }
    }

    getTimeElement () {
        let el = $(this.#timeId)

        if (el.length > 0) {
            return el
        }

        $('#smith-item-reqs')
            .closest('.row')
            .append(this.#rowHtml)

        return $(this.#timeId)
    }
}

class FletchingTimer extends Helper
{
    #rowHtml = `<div class="col-12" id="koh-fletching-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-fletching"><small class="mr-2">Will Take:</small><span id="koh-fletching-time-remaining"></span></div></div>`
    #itemId = '#koh-fletching-time-remaining'
    #updateInterval = 200
    #intervalId = null

    start () {
        this.updateTime()
        this.#intervalId = setInterval(() => this.updateTime(), this.#updateInterval)
    }

    stop () {
        $('#koh-fletching-time-row').remove()
        clearInterval(this.#intervalId)
    }

    updateTime () {
        let reqs = $('#fletch-item-reqs').text().trim().split(' ')

        let minTime = reqs.map((req, i) => {
            let have = $(`#fletching-item-have-${i}`).text().trim().replace(',', '')
            return {req: req, have: have, processes: have / req}
        }).reduce((min, info) => {
            if (min > info.processes) {
                min = info.processes
            }
            return min
        }, Infinity) * (fletchInterval / 1000)

        let time = `${(minTime / 60).toFixed(2)}m`

        if (fletchingMastery !== undefined && selectedFletch !== undefined && fletchingMastery[selectedFletch] !== undefined) {
            let avgPotentialExtra = minTime * ((0.25 * fletchingMastery[selectedFletch].mastery - 0.25) / 100)
            time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
        }

        this.getTimeElement().text(time)
    }

    getTimeElement () {
        let el = $(this.#itemId)

        if (el.length > 0) {
            return el
        }

        $('#fletch-item-reqs')
            .closest('.row')
            .append(this.#rowHtml)

        return $(this.#itemId)
    }
}

class AutoBonfire extends Helper
{
    #updateInterval = 200
    #intervalId = null

    start () {
        this.#intervalId = setInterval(() => this.lightIfNotLit(), this.#updateInterval)
    }

    stop () {
        clearInterval(this.#intervalId)
    }

    lightIfNotLit () {
        if (this.getBonFireProgress() === 0) {
            window.lightBonfire()
        }
    }

    getBonFireProgress () {
        return parseInt($('#skill-fm-bonfire-progress').css('width').substr(0, 1))
    }
}

class AutoLooter extends Helper{
    #checkInterval = 200
    #intervalId = null

    start () {
        this.#intervalId = setInterval(() => this.collectLoot(), this.#checkInterval)
    }

    stop () {
        clearInterval(this.#intervalId)
    }

    collectLoot () {
        if (this.getCurrentLootCount() > 0) {
            window.lootAll()
        }
    }

    getCurrentLootCount () {
        return parseInt($('#combat-loot-text').text().substring(17).split('/').map(s => s.trim())[0])
    }
}

helpers = {
    SmithingTimer,
    FletchingTimer,
    AutoBonfire,
    AutoLooter,
}