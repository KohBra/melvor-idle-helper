import SkillInterval from './SkillInterval.js'
import {
    configItemDescription,
    configItemForm, select2Single, genericInfoContainer,
    infoContainer,
    toolConfigInputName
} from '../htmlBuilder.js'
import { getMiningInterval } from '../helpers.js'
import { miningRocks } from '../const.js'

export default class AutoMiner extends SkillInterval
{
    _skill = CONSTANTS.skill.Mining
    _currentRock = null

    start () {
        if (!this.started) {
            this.createInfoElement()
        }
        super.start()
    }

    stop () {
        super.stop()
        this.removeInfoElement()
    }

    loop () {
        if (window.currentRock != this._currentRock) {
            this._currentRock = window.currentRock
        }

        for (let i of [0, 1, 2]) {
            let rockId = parseInt(this.config[`ore${i}`])
            if (rockId < 0 || this.isRockDepleted(rockId)) {
                continue
            }

            if (this._currentRock == rockId) {
                // already mining it
                break
            }

            this.startMining(rockId)
            break
        }
    }

    isRockDepleted (rockId) {
        return window.rockData[rockId].depleted
    }

    startMining (rockId) {
        this._currentRock = rockId
        window.mineRock(rockId, true)
    }

    createInfoElement () {
        let html = ''
        html += genericInfoContainer(
            'assets/media/main/statistics_header.svg',
            (this.calculateXp() * 60).toFixed(2) + ' xp/m',
            'Average xp per minute',
            'While swapping between selected ores',
            undefined,
            window.skillName[this._skill]
        )

        let selectedOres = ''
        for (let i of [0, 1, 2]) {
            let rockId = this.config[`ore${i}`]
            let img = 'assets/media/skills/mining/rock_empty.svg'
            let name = 'No Ore Selected'
            if (rockId) {
                if (rockId == miningRocks.runeEssence) {
                    img = `assets/media/bank/rune_essence.svg`
                } else {
                    img = `assets/media/skills/mining/rock_${oreTypes[rockId]}.svg`
                }
                name = window.setToUppercase(oreTypes[rockId])
            }

            selectedOres += `
<div class="media d-flex align-items-center push w-33">
    <div class="mr-3">
        ${img.length ? `<img class="shop-img" src="${img}">` : ''}
    </div>
    <div class="media-body">
        <div class="font-w600">${name}</div>
            <div class="font-size-sm">Ore ${i + 1}</div>
    </div>
</div>
`
        }
        this._infoEl = $(`<div class="row">${html}${infoContainer(selectedOres, 'col-12 col-md-8', window.skillName[this._skill])}</div>`)
        $('#mining-ores-container').before(this._infoEl)
    }

    removeInfoElement () {
        this._infoEl.remove()
    }

    calculateAvgXpSingle (mastery = null) {
        let timeToMine = (((mastery ?? window.miningOreMastery[window.currentRock].mastery) + 5) * (getMiningInterval() / 1000))
        let wait = miningData[window.currentRock].respawnInterval / 1000

        return ((timeToMine / (getMiningInterval() / 1000)) * items[miningData[window.currentRock].ore].miningXP) / (timeToMine + wait)
    }

    // Sad attempt at calculating xp with multiple ores. pretty much only works for the first 2 ores
    calculateXp () {
        const miningInterval = getMiningInterval() / 1000
        let totalXp = 0
        let timeRemaining = 0
        let totalTime = 0

        for (let i of [0, 1, 2]) {
            let rockId = this.config[`ore${i}`]
            let respawn = miningData[rockId].respawnInterval / 1000
            let mastery = window.miningOreMastery[rockId].mastery
            let time = (mastery + 5) * miningInterval
            let xp = items[miningData[rockId].ore].miningXP

            if (totalTime === 0) {
                totalTime = time + respawn
                totalXp += (mastery + 5) * xp
                timeRemaining = respawn
            } else {
                if (time > timeRemaining) {
                    totalXp += xp * (timeRemaining / miningInterval)
                    // out of time
                    break;
                } else {
                    timeRemaining -= time
                    totalXp += (mastery + 5) * xp
                }
            }
        }

        return totalXp / totalTime
    }

    buildConfigHtml () {
        let html = ''
        for (let i of [0, 1, 2]) {
            let ores = [{
                img: 'assets/media/skills/mining/rock_empty.svg',
                id: null,
                text: 'None',
            }].concat(oreTypes.map((oreType, rockId) => {
                if (miningData[rockId].level > window.skillLevel[this._skill]) {
                    return null
                }

                let img = `assets/media/skills/mining/rock_${oreType}.svg`
                if (rockId === miningRocks.runeEssence) {
                    // why
                    img = `assets/media/bank/rune_essence.svg`
                }
                return {
                    img: img,
                    id: rockId,
                    text: window.setToUppercase(oreType)
                }
            })).filter(option => option)
            html += configItemDescription(`Ore ${i + 1}`, `Will attempt to mine whenever available`)
            html += configItemForm(select2Single(ores, toolConfigInputName(this.getName(), `ore${i}`)))
        }
        return html
    }
}