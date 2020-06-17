import Tool from './Tool.js'

export default class IntervalTool extends Tool
{
    _intervalId = null
    _interval = 1000
    _loopFunc = 'loop'

    start () {
        super.start()
        // If we need to wait more than 10 seconds to run the first loop, just run it now.
        if (this._interval > 10000) {
            this[this._loopFunc]()
        }

        this._intervalId = setInterval(() => this[this._loopFunc](), this._interval)
    }

    stop () {
        super.stop()
        clearInterval(this._intervalId)
    }

    loop () {
        throw new Error('Implement loop()')
    }
}