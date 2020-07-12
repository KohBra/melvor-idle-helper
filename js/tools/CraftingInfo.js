import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class CraftingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Crafting

    insertEl () {
        $('#horizontal-navigation-crafting').closest('.col-12').before(this._el)
    }

    getCraftRequirements () {
        return this.getCurrentCraftItem().craftReq
    }

    getCraftAmount () {
        return this.getCurrentCraftItem().craftQty ?? 1
    }

    getCraftInterval () {
        return window.craftInterval
    }

    getChanceToKeep () {
        return 0.25 * this.getMastery() - 0.25
    }

    getChancesToDouble () {
        let chance = []

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }

        return chance
    }

    getCraftXp () {
        let xp = this.getCurrentCraftItem().craftingXP

        if (herbloreBonuses[17].bonus[0] === 0 && herbloreBonuses[17].charges > 0) {
            // this assumes the potion will be active for the whole duration of crafting.
            xp = xp * herbloreBonuses[17].bonus[1]
        }

        return xp
    }

    getCraftName () {
        return this.getCurrentCraftItem().name
    }

    getCurrentCraft () {
        return window.craftingItems[window.currentCraft]
    }

    getCurrentCraftItem () {
        let item = this.getCurrentCraft()
        if (item) {
            return items[item.itemID]
        } else {
            return null
        }
    }

    getMastery () {
        return window.craftingMastery[this.getCurrentCraft().craftingID].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}