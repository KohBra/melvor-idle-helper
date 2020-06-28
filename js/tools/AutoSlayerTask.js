import SkillInterval from './SkillInterval.js'

export default class AutoSlayerTask extends SkillInterval
{
    _skill = CONSTANTS.skill.Slayer
    #confirmInterval = null

    loop () {
        if (this.currentEnemy() !== this.currentSlayerTask() && this.#confirmInterval === null) {
            window.jumpToEnemy(this.currentSlayerTask())
            let count = 0
            this.#confirmInterval = setInterval(() => {
                count++
                if (this.currentEnemy() === this.currentSlayerTask() || count > 5) {
                    clearInterval(this.#confirmInterval)
                    this.#confirmInterval = null
                }
            }, 1000)
        }
    }

    currentEnemy () {
        return window.combatData.enemy.id
    }

    currentSlayerTask () {
        return window.slayerTask.length > 0
            ? window.slayerTask[0].monsterID
            : null
    }

    getDescription () {
        return 'Automatically switches to new slayer tasks when finishing the current slayer task.'
    }
}