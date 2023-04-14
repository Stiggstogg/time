import Phaser from 'phaser';

import Ship from '../sprites/Ship'

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private gameWidth!: number;
    private gameHeight!: number;
    private worldWidth!: number;
    private worldHeight!: number;
    private ship!: Ship;

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

        // set the world width and height
        this.worldWidth = this.gameWidth * 3;
        this.worldHeight = this.gameHeight * 3;

    }

    // load assets
    preload(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // create the world
        this.createWorld();

        // add the ship
        this.ship = this.add.existing(new Ship(this, this.worldWidth * 0.55, this.worldHeight * 0.55));
        this.cameras.main.startFollow(this.ship);

        // Add controls
        this.addControls();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.ship.move();

    }

    // Add keyboard input to the scene.
    addControls(): void {

        // add keyboard controls
        this.input.keyboard!.addKey('Space').on('down', function(this: GameScene) { this.inputPressed();}, this);

    }

    // Action which happens when input is provided: Change direction of the spaceship
    inputPressed(): void {

        this.ship.changeDirection();

    }

    // Create the world (background and boundaries)
    createWorld(): void {

        // set world boundaries
        this.matter.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        // set camera
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setScroll(this.worldWidth / 2, this.worldHeight - this.gameHeight);
        this.cameras.main.setSize(this.gameWidth, this.gameHeight);

        // add background
        this.add.image(0, 0, 'background').setOrigin(0);

    }

}