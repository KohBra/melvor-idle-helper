import IntervalTool from './IntervalTool.js'

export default class StackableLoot extends IntervalTool
{
    loop () {
        let stackedLoot = []
        window.droppedLoot.forEach(item => {
            let stackedItem = stackedLoot.find(i => i.itemID === item.itemID)

            if (!stackedItem) {
                stackedLoot.push(item)
            } else {
                stackedItem.qty += item.qty
            }
        })

        if (window.droppedLoot.length !== stackedLoot.length) {
            window.droppedLoot = stackedLoot
            window.loadLoot()
        }
    }
}