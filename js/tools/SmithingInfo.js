import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class SmithingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Smithing

    insertEl () {
        $('#horizontal-navigation-smithing').closest('.col-12').before(this._el)
    }

    requiredQtyModifier (bankItem, qty, requirement) {
        if (requirement.id === CONSTANTS.item.Coal_Ore && this.hasSkillCapeEquipped()) {
            return Math.floor(qty / 2)
        }

        return qty
    }

    getCraftRequirements () {
        return this.getCurrentSmithItem().smithReq
    }

    getCraftAmount () {
        return this.getCurrentSmithItem().smithingQty ?? 1
    }

    getCraftInterval () {
        return window.smithInterval
    }

    getChanceToKeep () {
        return Math.floor(this.getMastery() / 20) * 10
    }

    getChancesToDouble () {
        let mastery = this.getMastery()
        let chance = []
        if (mastery >= 90) {
            chance = [50]
        } else if (mastery >= 70) {
            chance = [40]
        } else if (mastery >= 50) {
            chance = [30]
        } else if (mastery >= 30) {
            chance = [20]
        } else if (mastery >= 10) {
            chance = [10]
        }

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }
        return chance
    }

    getCraftXp () {
        return this.getCurrentSmithItem().smithingXP
    }

    getCraftName () {
        return this.getCurrentSmithItem().name
    }

    getCurrentSmith () {
        return window.smithingItems[window.currentSmith]
    }

    getCurrentSmithItem () {
        let item = this.getCurrentSmith()
        if (item) {
            return items[item.itemID]
        } else {
            return null
        }
    }

    getMastery () {
        return window.smithingMastery[this.getCurrentSmith().smithingID].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}