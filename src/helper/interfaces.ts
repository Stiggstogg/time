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

export interface ShipData {
    x: number
    y: number
}

export interface BlockData {
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number
}

export interface ObjectiveData {
    x: number,
    y: number,
    color: number
}

// interface for all other keys (in the editore)
export interface OtherKeys {
    Z: Phaser.Input.Keyboard.Key,
    B: Phaser.Input.Keyboard.Key,
    Q: Phaser.Input.Keyboard.Key,
    W: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key
}