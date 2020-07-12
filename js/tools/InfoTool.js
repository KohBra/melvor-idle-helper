import { formatNumber, getBankItem, hasSkillcapeEquipped } from '../helpers.js'
import { genericInfoContainer } from '../htmlBuilder.js'
import SkillInterval from './SkillInterval.js'

export default class InfoTool extends SkillInterval
{
    _skill = null
    _el = null

    start () {
        if (!this.started) {
            this.createInfoElement()
        }
        super.start()
    }

    stop () {
        if (this.started) {
            this.removeInfoElement()
        }
        super.stop()
    }

    loop () {
        let maxCrafts = Infinity
        let requirements = this.getCraftRequirements()
        if (!requirements) {
            return
        }

        for (let requirement of requirements) {
            let bankItem = getBankItem(requirement.id)
            if (!bankItem) {
                maxCrafts = 0
                break
            }

            let requiredQty = requirement.qty

            requiredQty = this.requiredQtyModifier(bankItem, requiredQty, requirement)
            maxCrafts = Math.min(maxCrafts, Math.floor(bankItem.qty / requiredQty))
        }

        let chanceToKeep = this.getChanceToKeep()
        if (chanceToKeep > 0) {
            maxCrafts += maxCrafts * (chanceToKeep / 100)
        }
        let craftAmount = this.getCraftAmount()
        let totalCraftTime = maxCrafts * this.getCraftInterval() / 1000 // In seconds
        let totalItems = maxCrafts * craftAmount
        let chancesToDouble = this.getChancesToDouble()
        if (chancesToDouble.length > 0) {
            // For multiplicative stacking of double chances
            chancesToDouble.forEach(chance => {
                totalItems += totalItems * (chance / 100)
            })
        }
        let totalXp = maxCrafts * this.getCraftXp()
        let xpPerHour = totalXp / totalCraftTime * 60 * 60
        let itemsPerHour = totalItems / totalCraftTime * 60 * 60

        let skillname = window.skillName[this._skill].toLowerCase()
        let infoHtml = genericInfoContainer(
            `assets/media/skills/${skillname}/${skillname}.svg`,
            `${formatNumber(totalItems)} Total ${this.getCraftName()} (est)`,
            `${formatNumber(itemsPerHour)} ${this.getCraftName()} per hour (est)`,
            `${formatNumber(totalCraftTime / 60)}m time to craft all (est)`,
            `col-12 col-md-6 col-xl-6`,
            this._skill
        ) + genericInfoContainer(
            'assets/media/main/xp.svg',
            `${formatNumber(totalXp)} Estimated Total Xp`,
            `${formatNumber(xpPerHour)} Estimated Xp per hour`,
            ``,
            `col-12 col-md-6 col-xl-6`,
            this._skill
        )

        this._el.html(`<div class="row">${infoHtml}</div>`)
    }

    createInfoElement () {
        this._el = $(`<div class="col-12"></div>`)
        this.insertEl(this._el)
    }

    removeInfoElement () {
        this._el.remove()
    }

    hasSkillCapeEquipped () {
        return hasSkillcapeEquipped(this._skill)
    }

    requiredQtyModifier (bankItem, qty, requirement) {
        return qty
    }

    insertEl () {
        throw new Error('Implement insertEl()')
    }

    getCraftRequirements () {
        throw new Error('Implement getCraftRequirements()')
    }

    getCraftAmount () {
        throw new Error('Implement getCraftAmount()')
    }

    getCraftInterval () {
        throw new Error('Implement getCraftInterval()')
    }

    getChanceToKeep () {
        throw new Error('Implement getChanceToKeep()')
    }

    getChancesToDouble () {
        throw new Error('Implement getChanceToDouble()')
    }

    getCraftXp () {
        throw new Error('Implement getCraftXp()')
    }

    getCraftName () {
        throw new Error('Implement getCraftName()')
    }
}