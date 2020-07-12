import InfoTool from './InfoTool.js'
import { hasAorpheatEquipped } from '../helpers.js'

export default class FiremakingInfo extends InfoTool
{
    _skill = CONSTANTS.skill.Firemaking

    insertEl () {
        $('#skill-progress-bar-2').closest('.col-md-12').after(this._el)
    }

    getCraftRequirements () {
        return [{
            id: this.getCurrentLogItem().id,
            qty: 1
        }]
    }

    getCraftAmount () {
        let qty = this.hasSkillCapeEquipped() ? 1 : .4
        if (hasAorpheatEquipped()) {
            qty += qty * .10
        }
        return qty
    }

    getCraftInterval () {
        return this.getCurrentLog().interval
    }

    getChanceToKeep () {
        return 0
    }

    getChancesToDouble () {
        return 0
    }

    getCraftXp () {
        return this.getCurrentLog().xp + this.getCurrentLog().xp * (window.bonfireBonus / 100)
    }

    getCraftName () {
        return items[CONSTANTS.item.Coal_Ore].name
    }

    getCurrentLog () {
        return logsData[window.selectedLog]
    }

    getCurrentLogItem () {
        return items.find(item => item.firemakingID === window.selectedLog) ?? null
    }

    getDescription () {
        return 'Shows expected experience/item gain, and time to completion.'
    }
}