import IntervalTool from './IntervalTool.js'
import { getBankItem, getBankItemIndex } from '../helpers.js'
import { configItemDescription, configItemForm, itemSelect, toolConfigInputName } from '../htmlBuilder.js'

export default class AutoBury extends IntervalTool
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
                console.log(`Auto bury ${bankItem.qty} ${bankItem.name}`)
                window.buryItem(bankId, itemId, bankItem.qty)
            }
        })
    }

    buildConfigHtml () {
        return configItemDescription(`Bones to bury`)
            +  configItemForm(
                itemSelect(
                    items.map((i, id) => id).filter(id => items[id].isBones),
                    toolConfigInputName(this.getName(),  'items'), true)
            )
    }
}