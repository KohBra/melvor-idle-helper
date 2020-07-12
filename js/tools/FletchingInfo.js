import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class FletchingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Fletching

    insertEl () {
        $('#horizontal-navigation-fletching').closest('.col-12').before(this._el)
    }

    getCraftRequirements () {
        return this.getCurrentFletchItem().fletchReq
    }

    getCraftAmount () {
        return this.getCurrentFletchItem().fletchQty ?? 1
    }

    getCraftInterval () {
        return window.fletchInterval
    }

    getChanceToKeep () {
        return 0.25 * this.getMastery() - 0.25
    }

    getChancesToDouble () {
        let chance = []

        if (window.herbloreBonuses[16].bonus[0] === 0 && window.herbloreBonuses[16].charges > 0) {
            chance.push(window.herbloreBonuses[16].bonus[1])
        }

        if (this.hasSkillCapeEquipped()) {
            chance.push(100)
        }

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }

        return chance
    }

    getCraftXp () {
        return this.getCurrentFletchItem().fletchingXP
    }

    getCraftName () {
        return this.getCurrentFletchItem().name
    }

    getCurrentFletch () {
        return window.fletchingItems[window.currentFletch]
    }

    getCurrentFletchItem () {
        let item = this.getCurrentFletch()
        if (item) {
            return items[item.itemID]
        } else {
            return null
        }
    }

    getMastery () {
        return window.fletchingMastery[this.getCurrentFletch().fletchingID].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}