import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class HerbloreInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Herblore

    insertEl () {
        $('#horizontal-navigation-herblore').closest('.col-12').before(this._el)
    }

    getCraftRequirements () {
        return this.getCurrentPotionItem().herbloreReq
    }

    getCraftAmount () {
        return 1
    }

    getCraftInterval () {
        return window.herbloreInterval
    }

    getChanceToKeep () {
        return 0.25 * this.getMastery(this.getCurrentPotion().id) - 0.2
    }

    getChancesToDouble () {
        let chance = []

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }

        if (this.hasSkillCapeEquipped()) {
            chance.push(100)
        }

        return chance
    }

    getCraftXp () {
        return this.getCurrentPotion().herbloreXP
    }

    getCraftName () {
        return this.getCurrentPotionItem().name
    }

    getCurrentPotion () {
        return herbloreItemData[window.currentHerblore]
    }

    getCurrentPotionItem () {
        let potion = this.getCurrentPotion()
        if (potion) {
            return items[potion.itemID[this.getMasteryTier(potion.id)]]
        } else {
            return null
        }
    }

    getMasteryTier (potionId) {
        let mastery = this.getMastery(potionId)
        for (let i = masteryTiers.length; i > 0; i--) {
            if (mastery >= masteryTiers[i]) {
                return i
            }
        }
        return 0
    }

    getMastery (potionId) {
        return window.herbloreMastery[potionId].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}