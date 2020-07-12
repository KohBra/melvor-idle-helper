import SkillInterval from './SkillInterval.js'
import {
    bankHasItem,
    equipItemFromBank,
    getSetIdWithEquippedItem,
    hasItemEquipped,
    moveItemToCurrentSet,
    requiredItemForEnemy,
    showNotification
} from '../helpers.js'

export default class AutoSlayerTask extends SkillInterval
{
    _skill = CONSTANTS.skill.Slayer
    _confirmInterval = null
    _notifCooldown = 10000
    _lastNotif = null

    loop () {
        if (this.currentEnemy() !== this.currentSlayerTask() && this._confirmInterval === null) {
            let requiredItem = requiredItemForEnemy(this.currentSlayerTask())
            if (requiredItem !== null) {
                if (hasItemEquipped(requiredItem)) {
                    this.startTask()
                } else {
                    if (bankHasItem(requiredItem)) {
                        equipItemFromBank(requiredItem)
                        this.startTask()
                    } else if (getSetIdWithEquippedItem(requiredItem) !== null) {
                        moveItemToCurrentSet(requiredItem)
                        this.startTask()
                    } else {
                        if (this._lastNotif === null || Date.now() > this._lastNotif + this._notifCooldown) {
                            showNotification(items[requiredItem].media, `Next slayer task requires ${items[requiredItem].name}, but you don't have it.`, 'error')
                            this._lastNotif = Date.now()
                        }
                    }
                }
            } else {
                this.startTask()
            }
        }
    }

    currentEnemy () {
        return window.combatData.enemy.id
    }

    currentSlayerTask () {
        return window.slayerTask.length > 0
            ? window.slayerTask[0].monsterID
            : null
    }

    startTask () {
        window.jumpToEnemy(this.currentSlayerTask())
        let count = 0
        this._confirmInterval = setInterval(() => {
            count++
            if (this.currentEnemy() === this.currentSlayerTask() || count > 5) {
                clearInterval(this._confirmInterval)
                this._confirmInterval = null
            }
        }, 1000)
    }

    getDescription () {
        return 'Automatically switches to new slayer tasks when finishing the current slayer task.'
    }
}