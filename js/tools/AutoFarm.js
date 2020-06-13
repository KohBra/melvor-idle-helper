import IntervalTool from './IntervalTool.js'
import { farmingAreas, farmingSeedRequirements } from '../const.js'
import { debugLog, getBankItem } from '../helpers.js'

export default class AutoFarm extends IntervalTool
{
    _interval = 300000 // 5 minutes
     #seeds = {
         [farmingAreas.allotment]: 144, // onion seed
         [farmingAreas.herb]: 530, // lemontyle
         [farmingAreas.tree]: 163, // yew
     }

     #compost = {
         [farmingAreas.allotment]: 0,
         [farmingAreas.herb]: 5,
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
            let plantButtons = $('div[id^=farming-patch-] button.btn-success:not(.mr-1,.m-2)')
            let plantCount = plantButtons.length
            let seed = getBankItem(this.#seeds[area.id])

            if (plantCount * farmingSeedRequirements[area.id] > seed.qty) {
                debugLog(`Not enough ${seed.name} to plant all patches`)
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
}