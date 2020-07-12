import IntervalTool from './IntervalTool.js'
import { getBankItem, getBankItemIndex, showNotification } from '../helpers.js'

export default class AutoBury extends IntervalTool
{
    _interval = 1000
    _notifCooldown = 10000
    _lastNotif = null

    loop () {
        // todo: stats
        if (!Array.isArray(this.config.bones)) {
            return
        }

        this.config.bones.forEach(boneId => {
            let bankId = getBankItemIndex(parseInt(boneId))
            let bankItem = getBankItem(parseInt(boneId))
            if (bankId >= 0) {
                if (bankItem.qty >= 100) {
                    if (this._lastNotif === null || Date.now() > this._lastNotif + this._notifCooldown) {
                        showNotification(
                            items[boneId].media,
                            `Attempted to automatically bury ${items[boneId].name}, but you have more than 100.
                             If you want to continue auto burying, manually bury the stack. Otherwise remove the bone 
                             from the auto bury list.`,
                            'danger'
                        )
                        this._lastNotif = Date.now()
                    }
                } else {
                    console.log(`Auto bury ${bankItem.qty} ${bankItem.name}`)
                    window.buryItem(bankId, itemId, bankItem.qty)
                }
            }
        })
    }

    configComponent () {
        return 'auto-bury-config'
    }

    getDescription () {
        return 'Automatically buries bones found in your bank. Only buries selected bones.'
    }
}