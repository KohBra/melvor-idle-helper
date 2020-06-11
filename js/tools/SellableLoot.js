import IntervalTool from './IntervalTool.js'
import { sellItem } from '../helpers.js'

export default class SellableLoot extends IntervalTool
{
    #buttons = []
    #sellAllButton = null

    start () {
        super.start()
        this.addSellButtons()
    }

    stop () {
        super.stop()
        this.removeSellButtons()
    }

    loop () {
        this.addSellButtons()
    }

    addSellButtons () {
        $('#combat-loot-container').children().each((i, el) => {
            if ($(el).hasClass('d-flex')) {
                return
            }

            let button = $(`<button class="btn btn-sm btn-warning mx-2" data-loot-io="${i}">Sell</button>`)
            button.on('click', event => window.gpNotify(this.sell(window.droppedLoot[i])))
            $(el).addClass('d-flex flex-column').append(button)
            this.#buttons.push(button)
        })

        if (!this.#sellAllButton) {
            this.#sellAllButton = $(`<button type="button" class="btn btn-sm btn-warning ml-2">Sell All</button>`)
            this.#sellAllButton.on('click', event => {
                let gold = 0
                window.droppedLoot.forEach(item => gold += this.sell(item))
                window.gpNotify(gold)
            })
            $('[onclick="lootAll();"]').closest('h5').append(this.#sellAllButton)
        }
    }

    removeSellButtons () {
        this.#buttons.forEach(button => button.remove())
        this.#sellAllButton.remove()
    }

    sell (item) {
        let total = sellItem(item.itemID, item.qty)
        window.droppedLoot.splice(window.droppedLoot.indexOf(item), 1)
        window.loadLoot()
        return total
    }
}