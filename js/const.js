import * as tools from './tools/index.js'

// Tools
export const toolNames = Object.keys(tools)

// Config
export const debug = true
export const storageKey = 'helperConfig'
export const configKeys = {
    enabledTools: 'enabledTools',
}
export const configPageId = 'tool-config-container'

// Skills
export const combatSkills = [
    CONSTANTS.skill.Attack,
    CONSTANTS.skill.Strength,
    CONSTANTS.skill.Defence,
    CONSTANTS.skill.Hitpoints,
    CONSTANTS.skill.Ranged,
    CONSTANTS.skill.Magic,
    CONSTANTS.skill.Prayer,
    CONSTANTS.skill.Slayer,
]
export const nonCombatSkills = window.skillLevel.map((sk, i) => i)
    .filter(skill => !combatSkills.includes(skill))
export const attackStyleXpMap = {
    [CONSTANTS.attackStyle.Stab]: [CONSTANTS.skill.Attack],
    [CONSTANTS.attackStyle.Slash]: [CONSTANTS.skill.Strength],
    [CONSTANTS.attackStyle.Block]: [CONSTANTS.skill.Defense],
    [CONSTANTS.attackStyle.Accurate]: [CONSTANTS.skill.Ranged],
    [CONSTANTS.attackStyle.Rapid]: [CONSTANTS.skill.Ranged],
    [CONSTANTS.attackStyle.Longrange]: [CONSTANTS.skill.Ranged, CONSTANTS.skill.Defense],
    [CONSTANTS.attackStyle.Magic]: [CONSTANTS.skill.Magic],
    [CONSTANTS.attackStyle.Defensive]: [CONSTANTS.skill.Magic, CONSTANTS.skill.Defense],
}

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

export const farmingAreas = {
    allotment: 0,
    herb: 1,
    tree: 2,
}
export const farmingSeedRequirements = {
    [farmingAreas.allotment]: 3,
    [farmingAreas.herb]: 2,
    [farmingAreas.tree]: 1,
}
export const farmingAreaSeedKeys = {
    [farmingAreas.allotment]: 'allotmentSeeds',
    [farmingAreas.herb]: 'herbSeeds',
    [farmingAreas.tree]: 'treeSeeds',
}