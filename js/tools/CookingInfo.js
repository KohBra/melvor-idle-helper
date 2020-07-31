import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped, hasItemEquipped } from '../helpers.js'

export default class CookingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Cooking
    _cookingInterval = 3000

    insertEl () {
        $('#cooking').before(this._el)
    }

    getCraftRequirements () {
        return [{
            id: this.getCurrentFood(),
            qty: 1
        }]
    }

    getCraftAmount () {
        // this is a bit weird with cooking because the "craft" doesn't guarantee the desired craft outcome.
        // we will use the percentage of success as the qty here to simulate the burning of food.
        // %success + (mastery level * 0.6), capped at 99
        let saveChance = Math.min(99, 70 + (this.getMastery() * 0.6))

        if (this.hasSkillCapeEquipped()) {
            saveChance = 100
        }

        if (hasItemEquipped(CONSTANTS.item.Cooking_Gloves)) {
            saveChance = 100
        }

        return saveChance / 100
    }

    getCraftInterval () {
        return this._cookingInterval
    }

    getChanceToKeep () {
        return 0
    }

    getChancesToDouble () {
        let chance = []

        if (herbloreBonuses[9].bonus[0] === 0 && herbloreBonuses[9].charges > 0) {
            chance.push(herbloreBonuses[9].bonus[1])
        }

        if (hasAorpheatEquipped()) {
            chance.push(10)
        }

        return chance
    }

    getCraftXp () {
        return this.getCurrentFoodItem().cookingXP * (1 + cookingFireData[window.currentCookingFire - 1].bonusXP / 100)
    }

    getCraftName () {
        return items[this.getCurrentFoodItem().cookedItemID].name
    }

    getCurrentFood () {
        return window.selectedFood
    }

    getCurrentFoodItem () {
        let foodItemId = this.getCurrentFood()
        if (foodItemId) {
            return items[foodItemId]
        } else {
            return null
        }
    }

    getMastery () {
        return window.cookingMastery[this.getCurrentFoodItem().cookingID].mastery
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}