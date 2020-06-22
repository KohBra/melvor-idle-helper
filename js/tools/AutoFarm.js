import IntervalTool from './IntervalTool.js'
import { farmingAreas, farmingAreaSeedKeys, farmingSeedRequirements } from '../const.js'
import { debugLog, getBankItem } from '../helpers.js'
import {
    configItemDescription,
    configItemForm,
    itemSelect,
    selectField,
    toolConfigInputName
} from '../htmlBuilder.js'

export default class AutoFarm extends IntervalTool
{
    _skill = CONSTANTS.skill.Farming
    _interval = 30000 // 30 seconds

    loop () {
        this.harvest()
        this.plant()
    }

    harvest () {
        window.newFarmingAreas.forEach(area => {
            window.loadFarmingArea(area.id)
            $('div[id^=farming-patch-] button.btn-success.mr-1:not(.m-2)').each((i, el) => {
                if (el.innerText !== 'Harvest') {
                    return
                }

                $(el).click()
            })
        })
    }

    plant () {
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

                $(el).click()
            })
        })

        window.loadFarmingArea(previousArea)
        window.selectedSeed = null
        // Close the modal that opened for some reason...
        $('button[aria-label="Close"]:visible').click()
    }

    getAvailableSeed (areaId) {
        let areaKey = farmingAreaSeedKeys[areaId]
        let seeds = [
            this.config[`${areaKey}0`],
            this.config[`${areaKey}1`],
            this.config[`${areaKey}2`],
            this.config[`${areaKey}3`],
        ]

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

        let areaKey = farmingAreaSeedKeys[areaId]
        return parseInt(this.config[`${areaKey}Compost`])
    }

    buildConfigHtml () {
        let areas = {
            allotmentSeeds: 'Allotment Seeds',
            herbSeeds: 'Herb Seeds',
            treeSeeds: 'Tree Seeds',
        }
        let config = ''

        Object.keys(areas).forEach(areaKey => {
            let seeds = [null].concat(window[areaKey].filter(s => s.level <= window.skillLevel[CONSTANTS.skill.Farming])
                .map(seed => seed.itemID))
            let itemsHtml = '';
            for (let i of [0, 1, 2, 3]) {
                let css = ''

                if (i === 0) {
                    css = 'mr-4'
                } else if (i === 4) {
                    css = 'ml-4'
                } else {
                    css = 'mx-4'
                }

                itemsHtml += `<div class="w-25 ${css}">
                ${itemSelect(seeds, toolConfigInputName(this.getName(), `${areaKey}${i}`))}
            </div>`
            }
            config += configItemDescription(`${areas[areaKey]} priority`)
                + configItemForm(`<div class="d-flex">${itemsHtml}</div>`)
        })

        let compostOptions = [
            {id: 0, text: 0},
            {id: 1, text: 1},
            {id: 2, text: 2},
            {id: 3, text: 3},
            {id: 4, text: 4},
            {id: 5, text: 5},
            {id: 6, text: "Weird Gloop"},
        ]
        Object.keys(areas).forEach(areaKey => config
            += configItemDescription(`Compost ${areas[areaKey]}`)
            +  configItemForm(
                selectField(compostOptions, toolConfigInputName(this.getName(), areaKey + 'Compost'))
            )
        )

        return config
    }
}