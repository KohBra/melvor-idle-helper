import IntervalTool from './IntervalTool.js'
import { formatNumber } from '../helpers.js'
import { configItemDescription, configItemForm, numberField, toolConfigInputName } from '../htmlBuilder.js'

export default class ItemsPerHour extends IntervalTool
{
    CONFIG_HISTORY_DURATION = 'historyDuration'
    _previousBankMap = null
    _currentTime = null
    _changes = []
    _el = null
    _defaultIcon = 'assets/media/main/bank_header.svg'
    _interval = 50

    start () {
        this.addToolbarElement()
        this.reset()
        super.start()
    }

    stop () {
        super.stop()
        this.removeToolbarElement()
    }

    loop () {
        this.trimChanges()
        this._currentTime = Date.now()
        let bankMap = this.itemQtyMap(window.bank)
        if (this._previousBankMap === null) {
            this._previousBankMap = bankMap
            return
        }

        let difference = this.getDifferenceMap(bankMap, this._previousBankMap)
        if (difference.length === 0) {
            this._previousBankMap = bankMap
            return
        }

        this._changes = this._changes.concat(difference.map(itemId => {
            return {
                itemId: itemId,
                time: new Date(),
                qtyDelta: (bankMap[itemId] ?? 0) - (this._previousBankMap[itemId] ?? 0)
            }
        }))

        let time = (this._currentTime - this._changes[0].time) / 1000
        let average = this._changes.reduce((groups, change) => {
            if (groups[change.itemId] === undefined) {
                groups[change.itemId] = 0
            }
            groups[change.itemId] += change.qtyDelta
            return groups
        }, {})

        average = Object.keys(average).map(itemId => {
            let avg = (average[itemId] / time) * 60 * 60
            return {
                itemId: itemId,
                avg: isFinite(avg) ? avg : 0,
                qtyDelta: average[itemId],
                name: items[itemId].name,
                img: items[itemId].media,
            }
        })
        average = average.sort((a, b) => Math.abs(b.avg) - Math.abs(a.avg))

        this._previousBankMap = bankMap
        this.updateUi(average)
    }

    getDifferenceMap (currentMap, previousMap) {
        return Object.keys(currentMap).filter(itemId =>
            previousMap[itemId] === undefined || previousMap[itemId] !== currentMap[itemId]
        )
    }

    trimChanges () {
        let items = this._changes.reduce((items, change) => {
            if (items[change.itemId] === undefined) {
                items[change.itemId] = change.time
            }
            items[change.itemId] = items[change.itemId] > change.time ? items[change.itemId].time : change.time
            return items
        }, {})

        this._changes = this._changes.filter(change => {
            if (new Date() - change.time > 3600000) {
                return false
            }

            let mostRecentChange = items[change.itemId]
            return new Date - mostRecentChange <= (this.config[this.CONFIG_HISTORY_DURATION] ?? 5) * 60 * 1000;
        })
    }

    reset () {
        this._currentTime = null
        this._changes = []
    }

    itemQtyMap (itemList) {
        return itemList.reduce((items, bankItem) => {
            items[bankItem.id] = bankItem.qty
            return items
        }, {})
    }

    updateUi (averages) {
        // Update button text
        if (averages.length > 0) {
            $('#items-per-hour').text(`${formatNumber(averages[0].avg)} ${averages[0].name}/h`)
            $('#items-per-hour-current-item').attr('src', averages[0].img)
        } else {
            $('#items-per-hour').text(`0 items/h`)
            $('#items-per-hour-current-item').attr('src', this._defaultIcon)
        }

        // Update dropdown
        let activeItemHtml = ''
        averages.forEach(average => {
            activeItemHtml += this.activeItemRow(average)
        })
        $('#items-per-hour-active-items').html(`<div class="d-flex flex-column">${activeItemHtml}</div>`)
    }

    activeItemRow (average) {
        return `
<div class="d-flex p-2">
    <div><img class="skill-icon-sm" src="${average.img}"></div>
    <div class="d-flex flex-column pl-3 text-white flex-grow-1">
        <div class="small text-white-50 d-flex justify-content-between"><span>${average.name}</span><span>${average.qtyDelta} in the last ${this.config[this.CONFIG_HISTORY_DURATION]}m</span></div>
        <div>${formatNumber(average.avg)} items/h</div>
    </div>
</div>`
    }

    addToolbarElement () {
        this._el = $(`
<div class="d-inline-block ml-2">
    <button class="btn btn-sm btn-dual" id="tool-items-per-hour" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img class="skill-icon-xxs" id="items-per-hour-current-item" src="${this._defaultIcon}">
        <span id="items-per-hour"></span>
    </button>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="tool-items-per-hour">
        <div class="row no-gutters bg-primary text-center">
            <h5 class="dropdown-header text-uppercase">
                Items Being Acquired
            </h5>
        </div>
        <div id="items-per-hour-active-items"></div>
    </div>
</div>
`)
        $('header#page-header>div>div').last().prepend(this._el)
        $('#items-per-hour-inactive-toggle').on('click', e => {
            e.preventDefault()
            e.stopPropagation()
            let el = $(e.target)
            let shown = parseInt(el.data('shown'))
            if (shown) {
                $('#items-per-hour-inactive-items').hide()
                el.text('Show')
                el.data('shown', +false)
            } else {
                $('#items-per-hour-inactive-items').show()
                el.text('Hide')
                el.data('shown', +true)
            }
        }).click()
    }

    removeToolbarElement () {
        this._el.remove()
    }

    buildConfigHtml () {
        return configItemDescription(`Item change history duration (m)`, `How long in minutes to keep bank changes. Defaults to 5 minutes. I.E. If you get an item, and don't get another within 5 minutes, it won't be tracked in the items per hour. Set to 600 if you want to keep track of all items for 10 hours.`)
            + configItemForm(numberField(toolConfigInputName(this.getName(), this.CONFIG_HISTORY_DURATION), this.config[this.CONFIG_HISTORY_DURATION], 1, 1440))
    }

    getDescription () {
        return 'Keeps track of item gain/loss and displays an average gain/loss per hour for those items.'
    }
}