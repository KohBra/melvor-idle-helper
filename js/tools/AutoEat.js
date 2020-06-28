import IntervalTool from './IntervalTool.js'
import { doingSkill } from '../helpers.js'

export default class AutoEat extends IntervalTool
{
    _foodEfficiency = 90
    _interval = 50
    loop () {
        if (!this.inCombat()) {
            // Heal up while out of combat
            while (this.currentHp() < this.maxHp() && this.hasFood()) {
                this.eat()
            }
            return
        }

        if (this.canGetInstaKilled()) {
            this.run("Stopping combat, could be killed in one shot.")
        }

        if (this.currentHp() < this.maxHp()) {
            while (this.canDieInOneHit()) {
                let currentHp = this.currentHp()
                this.eat()
                if (this.currentHp() === currentHp) {
                    this.run("Stopping combat, out of food.")
                }
            }
        }
    }

    equipOtherFood () {
        for (let [i, food] of window.equippedFood.entries()) {
            if (food.qty > 0) {
                window.currentCombatFood = i
                return
            }
        }

        // All out of food...
    }

    run (reason) {
        if (reason) {
            window.Swal.fire({
                title: 'Escaped',
                html: reason,
                imageUrl: 'assets/media/skills/combat/run.svg',
                imageWidth: 64,
                imageHeight: 64,
                imageAlt: 'escaped'
            })
        }
        window.stopCombat(false, true, true)
    }

    eat () {
        if (this.equippedFood().qty <= 0) {
            this.equipOtherFood()
        }

        window.eatFood(this._foodEfficiency)
    }

    canDieInOneHit () {
        return this.currentHp() < this.maxHit()
    }

    canGetInstaKilled () {
        return this.maxHp() < this.maxHit()
    }

    currentHp () {
        return window.combatData.player.hitpoints
    }

    maxHp () {
        return skillLevel[CONSTANTS.skill.Hitpoints] * window.numberMultiplier
    }

    maxHit () {
        let specDamage = 0
        if (window.combatData.enemy.specialAttackID.length > 0) {
            let stunned = this.isPlayerStunned()
            for (let specId of window.combatData.enemy.specialAttackID) {
                let specAttack = enemySpecialAttacks[specId]
                let stunMultiplier = stunned ? specAttack.stunDamageMultiplier : 1
                specDamage = Math.max((specAttack.setDamage * window.numberMultiplier) * stunMultiplier, specDamage)
            }
        }

        let maxDamage = Math.max(window.combatData.enemy.maximumStrengthRoll, specDamage)
        return maxDamage - Math.floor(window.damageReduction / 100 * maxDamage)
    }

    maxBaseHit () {
        return window.combatData.enemy.maximumStrengthRoll
    }

    isPlayerStunned () {
        return window.combatData.player.stunned
    }

    inCombat () {
        return window.isInCombat
    }

    isThieving () {
        return doingSkill(CONSTANTS.skill.Thieving)
    }

    equippedFood () {
        return window.equippedFood[window.currentCombatFood]
    }

    hasFood () {
        return this.equippedFood().qty > 0
    }
}