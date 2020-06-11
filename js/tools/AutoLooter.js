import IntervalTool from './IntervalTool.js'
import { bankHasItem, isBankFull } from '../helpers.js'

export default class AutoLooter extends IntervalTool
{
    loop () {
        if (window.droppedLoot.length > 0) {
            window.droppedLoot.forEach((item, i) => {
                if (!isBankFull() || bankHasItem(item.itemID)) {
                    window.collectLoot(i, item.itemID, item.qty)
                }
            })
        }
    }
}