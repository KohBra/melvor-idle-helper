import SkillInterval from './SkillInterval.js'

export default class AutoBonfire extends SkillInterval
{
    _skill = CONSTANTS.skill.Firemaking

    loop () {
        if (window.bonfireBonus === 0) {
            window.lightBonfire()
        }
    }
}