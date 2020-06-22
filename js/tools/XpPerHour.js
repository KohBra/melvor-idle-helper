import IntervalTool from './IntervalTool.js'
import { arrayDifference, doingSlayer, formatNumber, isFarming } from '../helpers.js'
import { attackStyleXpMap, combatSkills, nonCombatSkills } from '../const.js'

export default class XpPerHour extends IntervalTool
{
    _skills = {}
    _activeSkills = []
    _newActive = []
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
        this._newActive = []
        this._currentTime = Date.now()

        let activeSkill = this.getCurrentSkill()
        if (activeSkill !== undefined && activeSkill !== null) {
            this.setActiveSkill(activeSkill)
        }

        if (window.isInCombat) {
            let skills = [
                CONSTANTS.skill.Hitpoints,
                CONSTANTS.skill.Prayer
            ]

            if (doingSlayer()) {
                skills.push(CONSTANTS.skill.Slayer)
            }

            skills.unshift(attackStyleXpMap[window.attackStyle][0])
            if (attackStyleXpMap[window.attackStyle] > 1) {
                skills.push(...attackStyleXpMap[window.attackStyle].slice(1))
            }

            skills.forEach(skill => {
                this.setActiveSkill(skill)
            })
        }

        if (isFarming()) {
            this.setActiveSkill(CONSTANTS.skill.Farming)
        }

        this.stopTrackingInactive()
        this.calculateXpPerHour()
        this.updateUi()
    }

    getCurrentSkill () {
        return window.offline.skill
    }

    setActiveSkill (skillId) {
        this._newActive.push(skillId)
        if (!this._activeSkills.includes(skillId)) {
            this._activeSkills.push(skillId)
            this._skills[skillId].startTime = Date.now()
            this._skills[skillId].startXp = window.skillXP[skillId]
            this._skills[skillId].xp = window.skillXP[skillId]
        } else {
            this._skills[skillId].xp = window.skillXP[skillId]
        }
    }

    setInactiveSkill (skillId) {
        this._activeSkills.splice(this._activeSkills.indexOf(skillId), 1)
    }

    stopTrackingInactive () {
        arrayDifference(this._activeSkills, this._newActive).forEach(skill => {
            this.setInactiveSkill(skill)
        })
        this._activeSkills = this._newActive
    }

    calculateXpPerHour () {
        this._activeSkills.forEach(skillId => {
            let xpGained = this._skills[skillId].xp - this._skills[skillId].startXp

            if (xpGained < 1) {
                return
            }

            let timeElapsed = Math.abs(this._currentTime - this._skills[skillId].startTime) / 1000
            this._skills[skillId].xph = (xpGained / timeElapsed) * 60 * 60
        })
    }

    reset () {
        this._activeSkills = []
        this._currentTime = null
        this._skills = {}
        window.skillXP.forEach((xp, skillId) => {
            this._skills[skillId] = {
                startTime: null,
                startXp: xp,
                xp: xp,
                xph: 0,
            }
        })
    }

    updateUi () {
        // Update button text
        if (this._activeSkills.length > 0) {
            $('#xp-per-hour').text(`${formatNumber(this._skills[this._activeSkills[0]].xph)} xp/h`)
            let skillName = window.skillName[this._activeSkills[0]].toLowerCase()
            $('#xp-per-hour-current-skill').attr('src', `assets/media/skills/${skillName}/${skillName}.svg`)
        } else {
            $('#xp-per-hour').text(`0 xp/h`)
            $('#xp-per-hour-current-skill').attr('src', this._defaultSkillIcon)
        }

        // Update dropdown
        let activeSkillHtml = ''
        this._activeSkills.forEach(skill => {
            activeSkillHtml += this.activeSkillDropdownRow(skill)
        })
        $('#xp-per-hour-active-skills').html(`<div class="d-flex flex-column">${activeSkillHtml}</div>`)

        let inactiveSkillHtml = '';
        [...nonCombatSkills, ...combatSkills].forEach(skill => {
            if (this._activeSkills.includes(parseInt(skill))) {
                return
            }

            inactiveSkillHtml += this.inactiveSkillDropdownRow(skill)
        })
        $('#xp-per-hour-inactive-skills').html(`<div class="d-flex flex-column">${inactiveSkillHtml}</div>`)
    }

    activeSkillDropdownRow (skill) {
        let skillName = window.skillName[skill].toLowerCase()
        return `
<div class="d-flex p-2">
    <div><img class="skill-icon-sm" src="assets/media/skills/${skillName}/${skillName}.svg"></div>
    <div class="d-flex flex-column pl-3 text-white">
        <div class="small text-white-50">${window.setToUppercase(skillName)}</div>
        <div>${formatNumber(this._skills[skill].xph)} xp/h</div>
    </div>
</div>`
    }

    inactiveSkillDropdownRow (skill) {
        let skillName = window.skillName[skill].toLowerCase()
        return `
<div class="d-flex pl-3 py-1">
    <div><img class="skill-icon-xs" src="assets/media/skills/${skillName}/${skillName}.svg"></div>
    <div class="d-flex flex-column pl-3 text-white">
        <div class="small text-white-50">${window.setToUppercase(skillName)}</div>
        <div>${formatNumber(this._skills[skill].xph)} xp/h</div>    
    </div>
</div>`
    }

    addXpElement () {
        this._el = $(`
<div class="d-inline-block ml-2">
    <button class="btn btn-sm btn-dual" id="tool-xp-per-hour" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img class="skill-icon-xxs" id="xp-per-hour-current-skill" src="${this._defaultSkillIcon}">
        <span id="xp-per-hour"></span>
    </button>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="tool-xp-per-hour">
        <div class="row no-gutters bg-primary text-center">
            <h5 class="dropdown-header text-uppercase">
                Active Skills
            </h5>
        </div>
        <div id="xp-per-hour-active-skills"></div>
        <div class="row no-gutters bg-black-25 text-center">
            <h5 class="d-flex dropdown-header justify-content-between text-uppercase w-100">
                <span>Inactive Skills</span>
                <a onclick="return false" class="text-white pointer-enabled small" id="xp-per-hour-inactive-toggle" data-shown="1">Show</a>
            </h5>
        </div>
        <div id="xp-per-hour-inactive-skills"></div>
    </div>
</div>
`)
        $('header#page-header>div>div').last().prepend(this._el)
        $('#xp-per-hour-inactive-toggle').on('click', e => {
            e.preventDefault()
            e.stopPropagation()
            let el = $(e.target)
            let shown = parseInt(el.data('shown'))
            if (shown) {
                $('#xp-per-hour-inactive-skills').hide()
                el.text('Show')
                el.data('shown', +false)
            } else {
                $('#xp-per-hour-inactive-skills').show()
                el.text('Hide')
                el.data('shown', +true)
            }
        }).click()
    }

    removeXpElement () {
        this._el.remove()
    }
}