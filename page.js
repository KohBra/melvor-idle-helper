(function (game) {
    setTimeout(() => {
        listenForMessages()
    })

    let options = {}
    let runningHelpers = {}
    const debug = false
    const debugLog = (...logs) => debug && console.log(...logs)

    function listenForMessages() {
        game.addEventListener("message", event => {
            debugLog('got message', event)
            if (event.data.type === 'runHelpers') {
                options = event.data.options
                runHelpers()
            }
        })
    }

    function runHelpers() {
        Object.keys(options).forEach(option => {
            if (options[option]) {
                runHelper(option)
            } else {
                stopHelper(option)
            }
        })
    }

    function runHelper(option) {
        if (runningHelpers[option]) {
            return
        }

        runningHelpers[option] = createHelper(option)
        runningHelpers[option].start()
    }

    function stopHelper(option) {
        if (runningHelpers[option]) {
            runningHelpers[option].stop()
            runningHelpers[option] = null
        }
    }

    function createHelper(className) {
        if (typeof helpers[className] === "undefined") {
            throw new Error(`Invalid helper name: ${className}`)
        }

        return new helpers[className]
    }

    function isBankFull() {
        return game.bank.length === game.bankMax + 11
    }

    function bankHasItem(itemId) {
        return game.bank.filter(item => item.id === itemId).length > 0
    }

    function sellItem(itemId, qty) {
        // For some reason items isn't on global window but can be accessed globally... ???
        let sellTotal = items[itemId].sellsFor * qty
        game.gp += sellTotal
        if (items[itemId].category === 'Woodcutting') {
            game.statsWoodcutting[1].count += qty
            game.statsWoodcutting[2].count += sellTotal
            game.updateStats('woodcutting')
        }
        if (items[itemId].category === 'Fishing') {
            game.statsFishing[3].count += qty
            game.statsFishing[4].count += sellTotal
            game.updateStats('fishing')
        }
        game.statsGeneral[1].count += qty
        game.statsGeneral[0].count += sellTotal
        game.updateStats('general')
        game.itemStats[itemId].timesSold += qty
        game.itemStats[itemId].gpFromSale += sellTotal
        game.updateGP()
    }

    class Helper {
        start() {
            throw new Error('Implement start()')
        }

        stop() {
            throw new Error('Implement end()')
        }
    }

    class IntervalHelper {
        _interval = 200
        _intervalId = null

        start() {
            this.update()
            this._intervalId = setInterval(() => this.update(), this._interval)
        }

        stop() {
            clearInterval(this._intervalId)
        }

        update() {
            throw new Error('Implement update()')
        }
    }

    class SmithingTimer extends IntervalHelper {
        #rowHtml = `<div class="col-12" id="koh-smithing-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-smithing"><small class="mr-2">Will Take:</small><span id="koh-smithing-time-remaining"></span></div></div>`
        #timeId = '#koh-smithing-time-remaining'

        stop() {
            $('#koh-smithing-time-row').remove()
            clearInterval(this._intervalId)
        }

        update() {
            let reqs = $('#smith-item-reqs').text().trim().split(' ')

            let minTime = reqs.map((req, i) => {
                let have = $(`#smithing-item-have-${i}`).text().trim().replace(',', '')
                return {req: req, have: have, processes: have / req}
            }).reduce((min, info) => {
                if (min > info.processes) {
                    min = info.processes
                }
                return min
            }, Infinity) * (game.smithInterval / 1000)

            let time = `${(minTime / 60).toFixed(2)}m`

            let chance = this.getKeepChance()
            if (chance) {
                let avgPotentialExtra = minTime * (chance / 100)
                time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
            }

            this.getTimeElement().text(time)
        }

        getKeepChance() {
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

        getTimeElement() {
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

    class FletchingTimer extends IntervalHelper {
        #rowHtml = `<div class="col-12" id="koh-fletching-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-fletching"><small class="mr-2">Will Take:</small><span id="koh-fletching-time-remaining"></span></div></div>`
        #itemId = '#koh-fletching-time-remaining'

        stop() {
            $('#koh-fletching-time-row').remove()
            clearInterval(this._intervalId)
        }

        update() {
            let reqs = $('#fletch-item-reqs').text().trim().split(' ')

            let minTime = reqs.map((req, i) => {
                let have = $(`#fletching-item-have-${i}`).text().trim().replace(',', '')
                return {req: req, have: have, processes: have / req}
            }).reduce((min, info) => {
                if (min > info.processes) {
                    min = info.processes
                }
                return min
            }, Infinity) * (game.fletchInterval / 1000)

            let time = `${(minTime / 60).toFixed(2)}m`

            if (game.fletchingMastery !== undefined &&
                game.selectedFletch !== undefined &&
                game.fletchingMastery[game.selectedFletch] !== undefined
            ) {
                let avgPotentialExtra = minTime * ((0.25 * game.fletchingMastery[game.selectedFletch].mastery - 0.25) / 100)
                time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
            }

            this.getTimeElement().text(time)
        }

        getTimeElement() {
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

    class AutoBonfire extends IntervalHelper {
        update() {
            if (this.getBonFireProgress() === 0) {
                game.lightBonfire()
            }
        }

        getBonFireProgress() {
            return parseInt($('#skill-fm-bonfire-progress').css('width').substr(0, 1))
        }
    }

    class AutoLooter extends IntervalHelper {
        update() {
            if (this.getCurrentLootCount() > 0) {
                game.droppedLoot.forEach((item, i) => {
                    if (!isBankFull() || bankHasItem(item.itemID)) {
                        collectLoot(i, item.itemID, item.qty)
                    }
                })
            }
        }

        getCurrentLootCount() {
            return parseInt($('#combat-loot-text').text().substring(17).split('/').map(s => s.trim())[0])
        }
    }

    class AutoSlayerTask extends IntervalHelper {
        #checkInterval = null

        update() {
            if (this.currentEnemy() !== this.currentSlayerTask() && this.#checkInterval === null) {
                game.jumpToEnemy(this.currentSlayerTask())
                this.#checkInterval = setInterval(() => {
                    if (this.currentEnemy() === this.currentSlayerTask()) {
                        clearInterval(this.#checkInterval)
                        this.#checkInterval = null
                    }
                }, 1000)
            }
        }

        currentEnemy() {
            return game.combatData.enemy.id
        }

        currentSlayerTask() {
            return game.slayerTask.length > 0
                ? game.slayerTask[0].monsterID
                : null
        }
    }

    class LootInfo extends IntervalHelper {
        #infoEl = null
        #valueEl = null

        start() {
            this.createInfoElement()
            super.start()
        }

        stop() {
            super.stop()
            this.deleteInfoElement()
        }

        update() {
            this.#valueEl.text(droppedLoot.length)
        }

        createInfoElement() {
            $('#nav-menu-show').children('.nav-main-heading').first()
                .append('<span style="float: right" id="sidebar-loot-indicator">Loot <span id="sidebar-loot-indicator-value">0</span>/16</span>')
            this.#infoEl = $('#sidebar-loot-indicator')
            this.#valueEl = $('#sidebar-loot-indicator-value')
        }

        deleteInfoElement() {
            this.#infoEl.remove()
            // this.#infoEl = null
            // this.#valueEl = null
        }
    }

    class StackableLoot extends IntervalHelper {
        update() {
            let stackedLoot = []
            let length =

                game.droppedLoot.forEach(item => {
                    let stackedItem = stackedLoot.find(i => i.itemID === item.itemID)

                    if (!stackedItem) {
                        stackedLoot.push(item)
                    } else {
                        stackedItem.qty += item.qty
                    }
                })

            if (game.droppedLoot.length != stackedLoot.length) {
                game.droppedLoot = stackedLoot
                game.loadLoot()
            }
        }
    }

    class SellableLoot extends IntervalHelper {
        #buttons = []

        start() {
            super.start()
            this.addSellButtons()
        }

        stop() {
            super.stop()
            this.removeSellButtons()
        }

        update() {
            this.addSellButtons()
        }

        addSellButtons() {
            $('#combat-loot-container').children().each((i, el) => {
                if ($(el).hasClass('d-flex')) {
                    return
                }

                let button = $(`<button class="btn btn-sm btn-warning mx-2" data-loot-io="${i}">Sell</button>`)
                button.on('click', event => {
                    this.sell(i)
                })
                $(el).addClass('d-flex flex-column').append(button)
                this.#buttons.push(button)
            })
        }

        removeSellButtons() {
            this.#buttons.forEach(button => button.remove())
        }

        sell(id) {
            let item = game.droppedLoot[id]
            sellItem(item.itemID, item.qty)
            game.droppedLoot.splice(id, 1)
            game.loadLoot()
        }
    }

    helpers = {
        SmithingTimer,
        FletchingTimer,
        AutoBonfire,
        AutoLooter,
        AutoSlayerTask,
        LootInfo,
        StackableLoot,
        SellableLoot,
    }
})(window)