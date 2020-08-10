import IntervalTool from './IntervalTool.js'
import { farmingAreaKeys, farmingSeedRequirements } from '../const.js'
import {
    bankHasItem,
    equipItemFromBank,
    equipSkillCape,
    getBankItem,
    getCurrentEquipment,
    hasSkillcapeEquipped,
    hasSkillcapeFor
} from '../helpers.js'

export default class AutoFarm extends IntervalTool
{
    RAKE_ID = 811
    _skill = CONSTANTS.skill.Farming
    _interval = 30000 // 30 seconds
    _previousEquipment = null
    _previousAmmo = null
    _equipped = false

    loop () {
        this.harvest()
        this.plant()
        if (this._equipped) {
            this.unequip()
        }
    }

    harvest () {
        window.farmstart = (window.farmstart ?? 0) + 1
        this._equipped = false
        window.newFarmingAreas.forEach(area => {
            window.loadFarmingArea(area.id)
            $('div[id^=farming-patch-] button.btn-success.mr-1:not(.m-2)').each((i, el) => {
                if (el.innerText !== 'Harvest') {
                    return
                }

                if (!this._equipped) {
                    this._equipped = true
                    this.equip()
                }

                $(el).click()
            })
        })
    }

    plant () {
        let planted = false
        let previousArea = window.currentFarmingArea
        window.newFarmingAreas.forEach(area => {
            window.loadFarmingArea(area.id)
            let plantButtons = $('div[id^=farming-patch-] button.btn-success:not(.mr-1,.m-2)')
            plantButtons.each((i, el) => {
                if (el.innerText !== 'Plant a Seed') {
                    return
                }

                let seed = this.getAvailableSeed(area.id)
                if (seed === null) {
                    return
                }

                let patchId = parseInt($(el).closest('div[id^=farming-patch-]')
                    .attr('id').replace(`farming-patch-${area.id}-`, ''))

                let compost = this.getCompost(area.id, seed)
                if (compost === 6) {
                    window.addGloop(area.id, patchId)
                } else if (compost > 0) {
                    window.addCompost(area.id, patchId, compost)
                }

                window.selectedSeed = seed
                window.selectedPatch = [area.id, patchId]
                window.plantSeed()
                planted = true

                $(el).click()
            })
        })

        if (planted) {
            window.loadFarmingArea(previousArea)
            window.selectedSeed = null
            // Close the modal that opened for some reason...
            $('button[aria-label="Close"]:visible').click()
        }
    }

    getAvailableSeed (areaId) {
        let areaKey = farmingAreaKeys[areaId]
        let seeds = this.config[`${areaKey}Seeds`] ?? []

        for (let seedId of seeds) {
            if (!parseInt(seedId)) {
                continue
            }

            let item = getBankItem(parseInt(seedId))
            if (item && item.qty >= farmingSeedRequirements[areaId]) {
                return parseInt(seedId)
            }
        }

        // no available seed
        return null
    }

    getCompost (areaId, seedId) {
        // don't compost when not needed
        if (farmingMastery[items[seedId].masteryID].mastery > 50) {
            return 0
        }

        let areaKey = farmingAreaKeys[areaId]
        return parseInt(this.config[`${areaKey}Compost`])
    }

    equip () {
        this._previousEquipment = window.equippedItems.slice()
        this._previousAmmo = window.ammo

        if (hasSkillcapeFor(this._skill)) {
            if (!hasSkillcapeEquipped(this._skill)) {
                equipSkillCape(this._skill)
            }
        }
        if (bankHasItem(this.RAKE_ID)) {
            equipItemFromBank(this.RAKE_ID)
        }
    }

    unequip () {
        this._previousEquipment.forEach((itemId, slot) => {
            let isQuiverSlot = slot === CONSTANTS.equipmentSlot.Quiver
            if (itemId === 0) {
                window.unequipItem(slot)
            } else if (getCurrentEquipment(slot) !== itemId || (isQuiverSlot && window.ammo < this._previousAmmo)) {
                if (isQuiverSlot) {
                    equipItemFromBank(itemId, -1, this._previousAmmo)
                } else {
                    equipItemFromBank(itemId)
                }
            }
        })
    }

    configComponent () {
        return 'auto-farm-config'
    }

    getDescription () {
        return 'Automatically plants, and harvests farming areas. Plants configured seeds, and also uses configured amount of compost/gloop.'
    }
}