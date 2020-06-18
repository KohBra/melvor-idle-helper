import { debug } from './const.js'

// generic
export const debugLog = (...logs) => debug && console.log(...logs)
export const swapObj = obj => obj.reduce((newObj, key) => {
    newObj[obj[key]] = key
    return newObj
}, {})
export const formatNumber = n => window.numberWithCommas(n.toFixed(2))

// bank
export const isBankFull = () => window.bank.length === window.bankMax + 11
export const getBankItem = itemId => window.bank.find(item => item.id === itemId)
export const bankHasItem = itemId => getBankItem(itemId) !== undefined
export const sellItem = (itemId, qty) => {
    // For some reason items isn't on global window but can be accessed globally... ???
    let sellTotal = items[itemId].sellsFor * qty
    window.gp += sellTotal
    if (items[itemId].category === 'Woodcutting') {
        window.statsWoodcutting[1].count += qty
        window.statsWoodcutting[2].count += sellTotal
        window.updateStats('woodcutting')
    }
    if (items[itemId].category === 'Fishing') {
        window.statsFishing[3].count += qty
        window.statsFishing[4].count += sellTotal
        window.updateStats('fishing')
    }
    window.statsGeneral[1].count += qty
    window.statsGeneral[0].count += sellTotal
    window.updateStats('general')
    window.itemStats[itemId].timesSold += qty
    window.itemStats[itemId].gpFromSale += sellTotal
    window.updateGP()

    return sellTotal
}

export const skillcapeEquipped = skillId => {
    let skillcapeItemId = skillcapeItems[skillId]
    return window.equippedItems[CONSTANTS.equipmentSlot.Cape] === skillcapeItemId
        || window.equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Max_Skillcape
}



// skills
const combatSkills = [
    CONSTANTS.skill.Attack,
    CONSTANTS.skill.Strength,
    CONSTANTS.skill.Defence,
    CONSTANTS.skill.Hitpoints,
    CONSTANTS.skill.Ranged,
    CONSTANTS.skill.Magic,
    CONSTANTS.skill.Prayer,
    CONSTANTS.skill.Slayer,
]

export const doingSkill = skill => {
    if (offline.skill !== null) {
        return window.offline.skill === skill
    } else {
        return window.isInCombat && combatSkills.indexOf(skill) >= 0
    }
}

export const getMiningInterval = () => {
    let interval = baseMiningInterval
    if (window.godUpgrade[2]) {
        interval *= 0.8
    }
    return interval *= 1 - pickaxeBonusSpeed[window.currentPickaxe] / 100
}