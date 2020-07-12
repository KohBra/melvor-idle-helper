import IntervalTool from './IntervalTool.js'
import { getBankItem, getBankItemIndex, showNotification } from '../helpers.js'

export default class AutoSell extends IntervalTool
{
    STAT_TOTAL_GOLD = 'gold'
    STAT_ITEMS_SOLD = 'sold'
    _interval = 1000

    loop () {
        if (!Array.isArray(this.config.items)) {
            return
        }

        this.config.items.forEach(itemId => {
            let bankId = getBankItemIndex(parseInt(itemId))
            let bankItem = getBankItem(parseInt(itemId))
            if (bankId >= 0) {
                let total = items[bankItem.id].sellsFor * bankItem.qty
                showNotification(
                    'assets/media/main/coins.svg',
                    `Auto sold ${bankItem.qty} ${bankItem.name} for ${total} gp`
                )
                this.addStatValue(this.STAT_TOTAL_GOLD, total)
                this.incrementStatValue(`${this.STAT_ITEMS_SOLD}.${itemId}`)
                window.showSaleNotifications = false
                window.sellItem(bankId, bankItem.qty)
                window.showSaleNotifications = true
            }
        })
    }

    configComponent () {
        return 'auto-sell-config'
    }

    getDescription () {
        return 'Automatically sells the configured items when found in your bank.'
    }
}