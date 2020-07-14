import IntervalTool from './IntervalTool.js'
import { getBankItem, getBankItemIndex } from '../helpers.js'

export default class AutoOpen extends IntervalTool
{
    _interval = 1000

    loop () {
        // todo: stats
        this.config.items.forEach(itemId => {
            let bankId = getBankItemIndex(parseInt(itemId))
            let bankItem = getBankItem(parseInt(itemId))
            if (bankId >= 0 && bankItem.qty > 0) {
                let item = items[itemId]
                if (item.canOpen) {
                    openBankItem(bankId, itemId, true)
                } else if (item.isToken) {
                    claimToken(bankId, itemId)
                } else if (item.isBankToken) {
                    claimBankToken(bankId, itemId)
                }
            }
        })
    }

    configComponent () {
        return 'auto-open-config'
    }

    getDescription () {
        return 'Automatically opens/uses select items found in your bank.'
    }
}