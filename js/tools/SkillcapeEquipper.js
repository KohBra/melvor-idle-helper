import IntervalTool from './IntervalTool.js'
import { currentSkill, equipSkillCape, hasSkillcapeEquipped, hasSkillcapeFor } from '../helpers.js'

export default class SkillcapeEquipper extends IntervalTool
{
    loop () {
        let skill = currentSkill()

        if (hasSkillcapeEquipped(skill)) {
            return
        }

        if (hasSkillcapeFor(skill)) {
            equipSkillCape(skill)
        } else {
            // try and equip fire skillcape for that sweet, sweet xp
            if (hasSkillcapeFor(CONSTANTS.skill.Firemaking) &&
                !hasSkillcapeEquipped(CONSTANTS.skill.Firemaking)
            ) {
                equipSkillCape(CONSTANTS.skill.Firemaking)
            }
        }
    }

    getDescription () {
        return 'Attempts to equip the skillcape for the active skill, if possible. If not possible it will attempt to equip the firemaking skillcape.'
    }
}