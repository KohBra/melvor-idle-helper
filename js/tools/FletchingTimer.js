// meh
//     class FletchingTimer extends IntervalHelper {
//         #rowHtml = `<div class="col-12" id="koh-fletching-time-row"><div class="font-size-sm font-w600 text-uppercase text-center text-muted border-top border-fletching"><small class="mr-2">Will Take:</small><span id="koh-fletching-time-remaining"></span></div></div>`
//         #itemId = '#koh-fletching-time-remaining'
//
//         stop() {
//             $('#koh-fletching-time-row').remove()
//             clearInterval(this._intervalId)
//         }
//
//         update() {
//             let reqs = $('#fletch-item-reqs').text().trim().split(' ')
//
//             let minTime = reqs.map((req, i) => {
//                 let have = $(`#fletching-item-have-${i}`).text().trim().replace(',', '')
//                 return {req: req, have: have, processes: have / req}
//             }).reduce((min, info) => {
//                 if (min > info.processes) {
//                     min = info.processes
//                 }
//                 return min
//             }, Infinity) * (window.fletchInterval / 1000)
//
//             let time = `${(minTime / 60).toFixed(2)}m`
//
//             if (window.fletchingMastery !== undefined &&
//                 window.selectedFletch !== undefined &&
//                 window.fletchingMastery[window.selectedFletch] !== undefined
//             ) {
//                 let avgPotentialExtra = minTime * ((0.25 * window.fletchingMastery[window.selectedFletch].mastery - 0.25) / 100)
//                 time += ` + ${(avgPotentialExtra / 60).toFixed(2)}m`
//             }
//
//             this.getTimeElement().text(time)
//         }
//
//         getTimeElement() {
//             let el = $(this.#itemId)
//
//             if (el.length > 0) {
//                 return el
//             }
//
//             $('#fletch-item-reqs')
//                 .closest('.row')
//                 .append(this.#rowHtml)
//
//             return $(this.#itemId)
//         }
//     }