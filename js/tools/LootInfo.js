import IntervalTool from './IntervalTool.js'

export default class LootInfo extends IntervalTool
{
    _infoEl = null
    _valueEl = null

    start () {
        this.createInfoElement()
        super.start()
    }

    stop () {
        super.stop()
        this.deleteInfoElement()
    }

    loop () {
        this._valueEl.text(droppedLoot.length)
    }

    createInfoElement () {
        $('#nav-menu-show').children('.nav-main-heading').first()
            .append('<span style="float: right" id="sidebar-loot-indicator">Loot <span id="sidebar-loot-indicator-value">0</span>/16</span>')
        this._infoEl = $('#sidebar-loot-indicator')
        this._valueEl = $('#sidebar-loot-indicator-value')
    }

    deleteInfoElement () {
        this._infoEl.remove()
    }

    getDescription () {
        return 'Adds a basic indicator in the sidebar for how much loot is not yet collected. Find near the "Combat" sidebar header.'
    }
}