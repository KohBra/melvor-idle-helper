import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class RunecraftingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Runecrafting

    insertEl () {
        $('#runecraft-category-0').closest('.col-12:not(#runecraft-category-0)').before(this._el)
    }

    getCraftRequirements () {
        return this.getCurrentRunecraftItem().runecraftReq
    }

    getCraftAmount () {
        return Math.floor((this.getCurrentRunecraftItem().runecraftQty ?? 1) + this.getMastery() / 10)
    }

    getCraftInterval () {
        return window.runecraftInterval
    }

    getChanceToKeep () {
        return this.hasSkillCapeEquipped() ? 50 : 0
    }

    getChancesToDouble () {
        let chance = [0]

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }

        return chance
    }

    getCraftXp () {
        return this.getCurrentRunecraftItem().runecraftingXP
    }

    getCraftName () {
        return this.getCurrentRunecraftItem().name
    }

    getCurrentRunecraft () {
        return window.runecraftingItems[window.currentRunecraft]
    }

    getCurrentRunecraftItem () {
        let item = this.getCurrentRunecraft()
        if (item) {
            return items[item.itemID]
        } else {
            return null
        }
    }

    getMastery () {
        return window.runecraftingMastery[this.getCurrentRunecraft().runecraftingID].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}