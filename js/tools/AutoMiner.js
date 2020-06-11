import SkillInterval from './SkillInterval.js'
import { miningRocks } from '../const.js'

export default class AutoMiner extends SkillInterval
{
    _skill = CONSTANTS.skill.Mining
    _currentRock = null
    _backupRock = miningRocks.coal
    _miningBackup = false
    // todo: make a queue of backups rather than just coal

    start () {
        super.start()
        this.setCurrentRock()
    }

    loop () {
        if (!this._currentRock && window.currentRock) {
            this.setCurrentRock()
        } else if (!window.currentRock) {
            return
        }

        if (this.isCurrentRockDepleted() && !this._miningBackup) {
            this._miningBackup = true
            window.mineRock(this._backupRock, true)
            setTimeout(() => {
                this._miningBackup = false
                window.mineRock(this._currentRock, true)
                window.rockReset(this._backupRock) // make the backup force reset even if its not dead
            }, this.currentRockRespawnTimer() + this._interval)
        }
    }

    setCurrentRock () {
        this._currentRock = window.currentRock
    }

    isCurrentRockDepleted () {
        return window.rockData[this._currentRock].depleted
    }

    currentRockRespawnTimer () {
        return miningData[this._currentRock].respawnInterval
    }
}