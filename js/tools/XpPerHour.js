import IntervalTool from './IntervalTool.js'
import { formatNumber } from '../helpers.js'

export default class XpPerHour extends IntervalTool
{
    _skills = null
    _currentSkill = null
    _currentTime = null
    _el = null
    _defaultSkillIcon = 'assets/media/main/statistics_header.svg'

    start () {
        this.addXpElement()
        this.reset()
        super.start()
    }

    stop () {
        super.stop()
        this.removeXpElement()
    }

    loop () {
        //todo: create dropdown to track multiple skills at a time
        this._currentTime = Date.now()
        let skill = this.getCurrentSkill()
        if (!skill) {
            return
        }

        if (skill !== this._currentSkill) {
            this.setCurrentSkill(skill)
        } else {
            this._skills[this._currentSkill].xp = window.skillXP[skill]
        }

        let xpPerHour = this.getXpPerHour()
        if (isNaN(xpPerHour)) {
            this._el.hide()
        } else {
            this._el.show()
            $('#xp-per-hour').text(`${formatNumber(xpPerHour)} xp/h`)
            let skillName = window.skillName[this._currentSkill].toLowerCase()
            $('#xp-per-hour-current-skill').attr('src', `assets/media/skills/${skillName}/${skillName}.svg`)
        }
    }

    getCurrentSkill () {
        // todo
        return window.isInCombat ? CONSTANTS.skill.Hitpoints : window.offline.skill
    }

    setCurrentSkill (skill) {
        this._currentSkill = skill
        this._skills[skill].startTime = Date.now()
        this._skills[skill].startXp = window.skillXP[skill]
        this._skills[skill].xp = window.skillXP[skill]
    }

    getXpPerHour () {
        let xpGained = this._skills[this._currentSkill].xp - this._skills[this._currentSkill].startXp
        let timeElapsed = Math.abs(this._currentTime - this._skills[this._currentSkill].startTime) / 1000

        return (xpGained / timeElapsed) * 60 * 60
    }

    reset () {
        this._currentSkill = null
        this._currentTime = null
        this._skills = {}
        window.skillXP.forEach((xp, skillId) => {
            this._skills[skillId] = {
                startTime: null,
                startXp: xp,
                xp: xp
            }
        })
    }

    addXpElement () {
        this._el = $(`
<div class="d-inline-block ml-2">
    <button class="btn btn-sm btn-dual">
        <img class="skill-icon-xxs" id="xp-per-hour-current-skill" src="${this._defaultSkillIcon}">
        <span id="xp-per-hour"></span>
    </button>
</div>
`)
        $('header#page-header>div>div').last().prepend(this._el)
    }

    removeXpElement () {
        this._el.remove()
    }
}