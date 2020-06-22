import IntervalTool from './IntervalTool.js'
import { configItemDescription, configItemForm, itemSelect, toolConfigInputName } from '../htmlBuilder.js'
import { getBankItem, getBankItemIndex } from '../helpers.js'

export default class AutoSell extends IntervalTool
{
    _interval = 1000
    loop () {
        // todo: stats
        if (!Array.isArray(this.config.items)) {
            return
        }

        this.config.items.forEach(itemId => {
            let bankId = getBankItemIndex(parseInt(itemId))
            let bankItem = getBankItem(parseInt(itemId))
            if (bankId >= 0) {
                console.log(`Auto sold ${bankItem.qty} ${bankItem.name}`)
                window.showSaleNotifications = false
                window.sellItem(bankId, bankItem.qty)
                window.showSaleNotifications = true
            }
        })
    }

    buildConfigHtml () {
        return configItemDescription(`AutoSell Items`)
            +  configItemForm(
                itemSelect(
                    items.map((i, id) => id)
                        .filter(id => {
                            if (window.itemStats[id] === undefined) {
                                return false
                            }

                            return window.itemStats[id].timesFound > 0
                        }),
                    toolConfigInputName(this.getName(),  'items'), true)
            )
    }
}