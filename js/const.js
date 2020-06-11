import * as tools from './tools/index.js'

// Tools
export const toolNames = Object.keys(tools)

// Config
export const debug = true
export const storageKey = 'helperConfig'
export const configKeys = {
    enabledTools: 'enabledTools',
}

// Misc
export const exportedGameVars = [
    'lightBonfire',
    'bonfireBonus',
]

// Skills
export const miningRocks = {
    runeEssence: 10,
    copper: 0,
    tin: 1,
    iron: 2,
    coal: 3,
    silver: 4,
    gold: 5,
    mithril: 6,
    adamant: 7,
    runite: 8,
    dragonite: 9,
}