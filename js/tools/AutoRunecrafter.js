import SkillInterval from './SkillInterval.js'

export default class AutoRunecrafter extends SkillInterval
{
    _interval = 1000
    _skill = CONSTANTS.skill.Runecrafting
    _currentRune = null
    items = null
    _crafting = false

    loop () {
        if (!this._crafting) {
            let craftNumber = this.config.amount

            let runes = this.getRunecraftingItems()
                .filter(i => this.config.runes.includes(i.itemID))
                // .filter(i => i.runecraftingCategory === 0 || i.runecraftingCategory === 6)

            this._currentRune = this._currentRune !== null && this._currentRune !== runes.length - 1
                ? this._currentRune + 1
                : 0

            if (runes[this._currentRune].runecraftingCategory === 6) {
                craftNumber = craftNumber / 2
            }

            clearTimeout(window.runecraftingTimeout) // stop the current runecraft
            window.selectedRunecraft = runes[this._currentRune].id
            window.startRunecrafting(true) // start the new one
            this._crafting = true
            setTimeout(() => {
                this._crafting = false
            }, 2000 * craftNumber)
        }
    }

    getRunecraftingItems () {
        return this.items ?? (this.items = runecraftingItems
            .map((item, runecraftingId) => {
                return {
                    id: runecraftingId,
                    item: items[item.itemID],
                    ...item
                }
            }))
    }

    getDescription () {
        return 'Rotates through every rune and crafts 100 each. Not 100 runes, 100 crafts.'
    }

    configComponent () {
        return 'auto-runecrafter-config'
    }
}