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
    _interval = 300000 // 5 minutes
    #seeds = {
        [farmingAreas.allotment]: 145,
        [farmingAreas.herb]: 530,
        [farmingAreas.tree]: 164,
    }

    #compost = {
        [farmingAreas.allotment]: 0,
        [farmingAreas.herb]: 0,
        [farmingAreas.tree]: 5,
    }

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
        window.newFarmingAreas.forEach(area => {
            window.loadFarmingArea(area.id)
            let areaKey = farmingAreaSeedKeys[area.id]
            let plantButtons = $('div[id^=farming-patch-] button.btn-success:not(.mr-1,.m-2)')
            let plantCount = plantButtons.length
            let seed = getBankItem(this.#seeds[area.id])
            let areaSeeds = window[areaKey]
            let seedLevel = null

            if (!seed || plantCount * farmingSeedRequirements[area.id] > seed.qty) {
                debugLog(`Not enough ${seed ? seed.name : this.#seeds[area.id]} to plant all patches`)
                return
            }

            let compost = this.#compost[area.id]

            plantButtons.each((i, el) => {
                if (el.innerText !== 'Plant a Seed') {
                    return
                }

                let patchId = parseInt($(el).closest('div[id^=farming-patch-]')
                    .attr('id').replace(`farming-patch-${area.id}-`, ''))

                if (compost) {
                    window.addCompost(area.id, patchId, compost)
                }

                window.selectedSeed = seed.id
                window.selectedPatch = [area.id, patchId]
                window.plantSeed()

                $(el).click()
            })
        })

        window.selectedSeed = null
        // Close the modal that opened for some reason...
        $('button[aria-label="Close"]:visible').click()
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
                for (let i of [0, 1, 2, 4]) {
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
            }
        )

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