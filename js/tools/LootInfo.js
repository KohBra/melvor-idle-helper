import IntervalTool from './IntervalTool.js'

export default class LootInfo extends IntervalTool
{
    #infoEl = null
    #valueEl = null

    start () {
        this.createInfoElement()
        super.start()
    }

    stop () {
        super.stop()
        this.deleteInfoElement()
    }

    loop () {
        this.#valueEl.text(droppedLoot.length)
    }

    createInfoElement () {
        $('#nav-menu-show').children('.nav-main-heading').first()
            .append('<span style="float: right" id="sidebar-loot-indicator">Loot <span id="sidebar-loot-indicator-value">0</span>/16</span>')
        this.#infoEl = $('#sidebar-loot-indicator')
        this.#valueEl = $('#sidebar-loot-indicator-value')
    }

    deleteInfoElement () {
        this.#infoEl.remove()
    }

    getDescription () {
        return 'Adds a basic indicator in the sidebar for how much loot is not yet collected. Find near the "Combat" sidebar header.'
    }
}