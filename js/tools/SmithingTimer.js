// meh
// Need
// - Time to finish all
// - Xp after all finished
// - total crafted after all finished
//
//     class SmithingTimer extends IntervalHelper {
//         #rowHtml = `<div class="col-12" id="koh-smithing-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-smithing"><small class="mr-2">Will Take:</small><span id="koh-smithing-time-remaining"></span></div></div>`
//         #timeId = '#koh-smithing-time-remaining'
//
//         stop() {
//             $('#koh-smithing-time-row').remove()
//             clearInterval(this._intervalId)
//         }
//
//         update() {
//             let reqs = $('#smith-item-reqs').text().trim().split(' ')
//
//             let minTime = reqs.map((req, i) => {
//                 let have = $(`#smithing-item-have-${i}`).text().trim().replace(',', '')
//                 return {req: req, have: have, processes: have / req}
//             }).reduce((min, info) => {
//                 if (min > info.processes) {
//                     min = info.processes
//                 }
//                 return min
//             }, Infinity) * (window.smithInterval / 1000)
//
//             let time = `${(minTime / 60).toFixed(2)}m`
//
//             let chance = this.getKeepChance()
//             if (chance) {
//                 let avgPotentialExtra = minTime * (chance / 100)
//                 time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
//             }
//
//             this.getTimeElement().text(time)
//         }
//
//         getKeepChance() {
//             // Yikes
//             if (smithingMastery !== undefined &&
//                 smithingItems !== undefined &&
//                 selectedSmith !== undefined &&
//                 smithingItems[selectedSmith] !== undefined &&
//                 smithingMastery[smithingItems[selectedSmith].smithingID] !== undefined
//             ) {
//                 return Math.floor(smithingMastery[smithingItems[selectedSmith].smithingID].mastery / 20) * 10
//             }
//         }
//
//         getTimeElement() {
//             let el = $(this.#timeId)
//
//             if (el.length > 0) {
//                 return el
//             }
//
//             $('#smith-item-reqs')
//                 .closest('.row')
//                 .append(this.#rowHtml)
//
//             return $(this.#timeId)
//         }
//     }
//