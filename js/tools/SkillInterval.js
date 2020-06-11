import IntervalTool from './IntervalTool.js'
import { doingSkill } from '../helpers.js'

export default class SkillInterval extends IntervalTool
{
    _skill = null
    _loopFunc = 'skillLoop'

    skillLoop () {
        if (doingSkill(this._skill)) {
            this.loop()
        }
    }
}