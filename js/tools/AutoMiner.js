import SkillInterval from './SkillInterval.js'
import { genericInfoContainer, infoContainer, } from '../htmlBuilder.js'
import { formatNumber, getMiningInterval, skillcapeEquipped } from '../helpers.js'
import { miningRocks } from '../const.js'

export default class AutoMiner extends SkillInterval
{
    COAL = 3
    _skill = CONSTANTS.skill.Mining
    _currentRock = null

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
        if (window.currentRock != this._currentRock) {
            this._currentRock = window.currentRock
        }

        for (let i of [1, 2, 3]) {
            let rockId = parseInt(this.config.ores[i])
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

        this.updateUi()
    }

    isRockDepleted (rockId) {
        return window.rockData[rockId].depleted
    }

    startMining (rockId) {
        this._currentRock = rockId
        window.mineRock(rockId, true)
    }

    updateUi () {
        let html = ''
        let orePerMinute = [0, 0, 0]
        let selectedOres = ''
        let xp = this.calculateXp()
        let estimatedOre = this.calculateOre()
        // Add xp info
        html += genericInfoContainer(
            'assets/media/main/statistics_header.svg',
            formatNumber(xp * 60) + ' xp/m',
            formatNumber(xp * 60 * 60) + ' xp/h',
            'Estimated xp gain for selected ores',
            'col-12 col-md-6 col-xl-3',
            window.skillName[this._skill]
        )

        // Add selected ores info
        for (let i of [1, 2, 3]) {
            let rockId = parseInt(this.config.ores[i])
            let img = 'assets/media/skills/mining/rock_empty.svg'
            let name = 'No Ore Selected'
            if (rockId) {
                if (rockId == miningRocks.runeEssence) {
                    img = `assets/media/bank/rune_essence.svg`
                } else {
                    img = `assets/media/skills/mining/rock_${oreTypes[rockId]}.svg`
                }
                name = window.setToUppercase(oreTypes[rockId])
                orePerMinute[i] = name
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
</div>`
        }

        // Add ore info
        html += genericInfoContainer(
            'assets/media/main/bank_header.svg',
            `${formatNumber(estimatedOre[0] * 60 * 60)} ${orePerMinute[0]}/h`,
            `${formatNumber(estimatedOre[1] * 60 * 60)} ${orePerMinute[1]}/h`,
            'Estimated ore gain',
            'col-12 col-md-6 col-xl-3',
            window.skillName[this._skill]
        )

        this._infoEl.html(`${html}${infoContainer(selectedOres, 'col-12 col-md-12 col-xl-6', window.skillName[this._skill])}`)
    }

    createInfoElement () {
        this._infoEl = $(`<div class="row"></div>`)
        $('#mining-ores-container').before(this._infoEl)
    }

    removeInfoElement () {
        this._infoEl.remove()
    }

    /**
     * Not used, but mildly interesting.
     * Calculates xp/s on the current rock, at a particular(or current) mastery level
     */
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

        for (let i of [1, 2, 3]) {
            let rockId = parseInt(this.config.ores[i])
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
                    break
                } else {
                    // mined the whole rock
                    timeRemaining -= time
                    totalXp += (mastery + 5) * xp
                }
            }
        }

        return totalXp / totalTime
    }

    calculateOre () {
        let ores = []
        const miningInterval = getMiningInterval() / 1000
        let timeRemaining = 0
        let totalTime = 0

        for (let i of [1, 2, 3]) {
            let rockId = parseInt(this.config.ores[i])
            let respawn = miningData[rockId].respawnInterval / 1000
            let mastery = window.miningOreMastery[rockId].mastery
            let oreCount = (mastery + 5)
            let time = (mastery + 5) * miningInterval
            let xp = items[miningData[rockId].ore].miningXP

            if (ores.length === 0) {
                totalTime = time + respawn
                ores[i] = oreCount
                timeRemaining = respawn
            } else {
                if (time > timeRemaining) {
                    ores[i] = Math.floor(timeRemaining / miningInterval)
                    // out of time
                    break
                } else {
                    // mined the whole rock
                    timeRemaining -= time
                    ores[i] = oreCount
                }
            }
        }

        let wearingSkillcap = skillcapeEquipped(this._skill)
        let coalFromCape = wearingSkillcap ? ores.reduce((total, oreCount) => total += oreCount, 0) : 0

        // need ore/s for each ore type
        return ores.map((oreCount, index) => {
            let rockId = parseInt(this.config.ores[index])
            let mastery = window.miningOreMastery[rockId].mastery
            // Add average additional ores from mastery doubling
            oreCount *= 1 + Math.floor(mastery / 10) / 100

            if (rockId == this.COAL) {
                // if its coal, add the additional cape coal
                oreCount += coalFromCape
            }

            return oreCount / totalTime
        })
    }

    configComponent () {
        return 'auto-miner-config'
    }

    getDescription () {
        return 'Automatically mines the configured ores, and switches between them when the others are on cooldown.'
    }
}