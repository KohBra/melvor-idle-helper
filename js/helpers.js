import { attackStyleXpMap, combatSkills, debug } from './const.js'

// generic
export const debugLog = (...logs) => debug && console.log(...logs)
export const swapObj = obj => obj.reduce((newObj, key) => {
    newObj[obj[key]] = key
    return newObj
}, {})
export const arrayDifference = (arrA, arrB) => arrA.filter(e => !arrB.includes(e))
export const arraySymmetricDifference = (arrA, arrB) => arrA
    .filter(e => !arrB.includes(e))
    .concat(arrB.filter(e => !arrA.includes(e)))
export const formatNumber = (n, c = 2) => window.numberWithCommas(n.toFixed(c))

// bank
export const isBankFull = () => window.bank.length === window.bankMax + 11
export const getBankItemIndex = itemId => window.bank.findIndex(item => item.id === itemId)
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
export const showNotification = (img, message, type = 'success') => Toastify({
    text: `
<img class="notification-img" src="${img}">
<span class="badge badge-${type}">
    ${message}
</span>`,
    duration: 2000,
    gravity: "bottom",
    position: 'center',
    backgroundColor: "transparent",
    stopOnFocus: false,
}).showToast();


// skills
export const doingSkill = skill => {
    if (window.offline.skill !== null) {
        return window.offline.skill === skill
    } else {
        return window.isInCombat && combatSkills.indexOf(skill) >= 0
    }
}

export const currentSkill = () => {
    let skill = window.offline.skill
    if (skill !== null) {
        return skill
    }

    if (window.isInCombat) {
        if (doingSlayer()) {
            return CONSTANTS.skill.Slayer
        } else {
            return attackStyleXpMap[window.attackStyle][0]
        }
    }

    return null
}

export const doingSlayer = () => {
    return window.isInCombat
    && window.slayerTask.length > 0
    && window.slayerTask[0].monsterID === window.enemyInCombat
}

export const isFarming = () => window.newFarmingAreas.reduce((sum, area) =>
    sum += area.patches.reduce((sum, patch) =>
        sum += patch.seedID, 0), 0
) > 0

export const getMiningInterval = () => {
    let interval = baseMiningInterval
    if (window.godUpgrade[2]) {
        interval *= 0.8
    }
    return interval *= 1 - pickaxeBonusSpeed[window.currentPickaxe] / 100
}

// items
export const getCurrentEquipment = slot => window.equippedItems[slot]
export const skillcapeItemId = skill => skillcapeItems[skill]
export const getSetIdWithEquippedItem = (itemId, slot = null) => {
    for (let setId of [0, 1, 2]) {
        if (hasItemEquipped(itemId, slot, setId)) {
            return setId
        }
    }

    return null
}
export const hasItemEquipped = (itemId, slot = null, setId = null) => {
    if (setId === null) {
        setId = currentEquipmentSet()
    }

    if (slot === null) {window.equipmentSets[window.selectedEquipmentSet]
        return window.equipmentSets[setId].equipment.indexOf(itemId) >= 0
    } else {
        return window.equipmentSets[setId].equipment[slot] === itemId
    }
}
export const currentEquipmentSet = () => {
    return window.selectedEquipmentSet
}
export const equipItemFromBank = (itemId, equipmentSet = -1) => {
    window.equipItem(getBankItemIndex(itemId), itemId, 1, equipmentSet)
}
export const unequipItem = (slot, equipmentSet = currentEquipmentSet()) => {
    let currentSet = currentEquipmentSet()
    window.setEquipmentSet(equipmentSet)
    window.unequipItem(CONSTANTS.equipmentSlot.Cape)
    window.setEquipmentSet(currentSet)
}

// skillcape management
export const hasSkillcapeInBank = skill => getBankItem(skillcapeItemId(skill)) !== undefined
export const hasSkillcapeFor = skill => hasSkillcapeInBank(skill)
    || getSetIdWithEquippedItem(skillcapeItemId(skill), CONSTANTS.equipmentSlot.Cape) !== null
export const hasSkillcapeEquipped = skill => hasItemEquipped(skillcapeItemId(skill), CONSTANTS.equipmentSlot.Cape)
export const equipSkillCape = skill => {
    let itemId = skillcapeItemId(skill)
    if (hasSkillcapeInBank(skill)) {
        equipItemFromBank(itemId)
    } else {
        // Maybe make a config option to swap equipment sets rather than equip to current.
        unequipItem(CONSTANTS.equipmentSlot.Cape, getSetIdWithEquippedItem(itemId))
        equipItemFromBank(itemId)
    }
}