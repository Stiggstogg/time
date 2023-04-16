// Here some interfaces are defined for certain objects which come from outside

// interface for the game data which is sent between scenes
export interface GameData {
    level: number
}

// interface for the level json
export interface LevelData {
    ship: ShipData,
    blocks: BlockData[],
    objectives: ObjectiveData[]
}

interface ShipData {
    x: number
    y: number
}

interface BlockData {
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number
}

interface ObjectiveData {
    x: number,
    y: number
}