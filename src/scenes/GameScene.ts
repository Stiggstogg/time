import Phaser from 'phaser';

import Sponge from '../sprites/Sponge'

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private gameWidth!: number;
    private gameHeight!: number;
    private sponge!: Sponge;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(): void {

        // get game width and height
        this.gameWidth = Number(this.sys.game.config.width);
        this.gameHeight = Number(this.sys.game.config.height);

    }

    // load assets
    preload(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // sprite
        this.sponge = this.add.existing(new Sponge(this, 100, 100));

        // Instruction / press key text
        this.add.text(this.gameWidth / 2, this.gameHeight - 46,
            'Use arrow keys or W, A, S, D to move Sponge Bob around\n' +
            'Click with the mouse on it to finish the game', {
                font: '20px Arial',
                color: '#27ff00'
            }).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }

    // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard.addKey('Down').on('down', function(this: GameScene) { this.sponge.move('down') }, this);
        this.input.keyboard.addKey('S').on('down', function(this: GameScene) { this.sponge.move('down') }, this);
        this.input.keyboard.addKey('Up').on('down', function(this: GameScene) { this.sponge.move('up') }, this);
        this.input.keyboard.addKey('W').on('down', function(this: GameScene) { this.sponge.move('up') }, this);
        this.input.keyboard.addKey('Left').on('down', function(this: GameScene) { this.sponge.move('left') }, this);
        this.input.keyboard.addKey('A').on('down', function(this: GameScene) { this.sponge.move('left') }, this);
        this.input.keyboard.addKey('Right').on('down', function(this: GameScene) { this.sponge.move('right') }, this);
        this.input.keyboard.addKey('D').on('down', function(this: GameScene) { this.sponge.move('right') }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard.addKey('Enter').on('down', function(this: GameScene) { this.spaceEnterKey() }, this);
        this.input.keyboard.addKey('Space').on('down', function(this: GameScene) { this.spaceEnterKey() }, this);

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey(): void {

        console.log('Space or Enter key pressed!');

    }

}