import Phaser from 'phaser';
import Ship from '../sprites/Ship'
import Block from '../sprites/Block'
import Objective from '../sprites/Objective';
import gameOptions from '../helper/gameOptions';
import eventsCenter from '../helper/eventsCenter';
import {GameData, LevelData} from '../helper/interfaces';

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private ship!: Ship;
    private objectives!: Objective[];
    private gameData!: GameData;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

        // initialize variables
        this.objectives = [];

    }

    // Creates all objects of this scene
    create(): void {

        const a = document.createElement('a');
        const file = new Blob(["test"], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'juhuu.txt';
        a.click();


        // create the world
        this.createWorld();

        // create level
        this.createLevel();

        // add the ship and camera should follow it
        this.cameras.main.startFollow(this.ship);

        // define events and actions for it
        this.eventsHandlingSetup();

        // Add controls
        this.addControls();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.ship.update();

    }

    // Add keyboard and touch input to the scene.
    addControls(): void {

        // add keyboard controls
        this.input.keyboard!.addKey('Space').on('down', function(this: GameScene) { this.inputPressed();}, this);

        // add mouse and touch controls
        this.input.on('pointerdown', function(this: GameScene) { this.inputPressed(); }, this);

    }

    // Action which happens when input is provided: Change direction of the spaceship
    inputPressed(): void {

        this.ship.changeDirection();

    }

    // setup all the events and make sure they are also cleaned up at the end
    eventsHandlingSetup() {

        // event when ship collides with objective
        eventsCenter.on('objectiveCollide', function(this: GameScene, objective: Objective) {

            objective.destroy();                                                            // destroy the objective
            this.objectives.splice(this.objectives.indexOf(objective), 1);          // remove it from the list of objectives

            if (this.objectives.length < 1) {
                console.log('you won!');
                this.scene.start('Game');
            }

        }, this);

        // Cleanup the events when the scene is shut down
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, function() {
            eventsCenter.off('objectiveCollide');
        });

    }

    // Create the world (background and boundaries)
    createWorld(): void {

        // set world boundaries
        this.matter.world.setBounds(0, 0, gameOptions.worldWidth, gameOptions.worldHeight);

        // set camera
        this.cameras.main.setBounds(0, 0, gameOptions.worldWidth, gameOptions.worldHeight);
        this.cameras.main.setScroll(gameOptions.worldWidth / 2, gameOptions.worldHeight - gameOptions.gameHeight);
        this.cameras.main.setSize(gameOptions.gameWidth, gameOptions.gameHeight);

        // add background
        this.add.image(0, 0, 'background').setOrigin(0);

    }

    // Create level
    createLevel(): void {

        // get the level data from the corresponding json file
        const levelNumber: number = this.gameData.level;                // get the number of the level
        const levelString: string = 'level' + levelNumber.toString();   // create the string with the level name (key to the loaded json)
        const levelData: LevelData = this.cache.json.get(levelString);  // get the data from the json

        // place the ship
        this.ship = this.add.existing(new Ship(this,
            gameOptions.worldWidth * levelData.ship.x,
            gameOptions.worldHeight * levelData.ship.y
        ));

        // place all blocks
        for (let i = 0; i < levelData.blocks.length; i++) {

            this.add.existing(new Block(this,
                gameOptions.worldWidth * levelData.blocks[i].x,
                gameOptions.worldHeight * levelData.blocks[i].y
            ));

        }

        // place all objectives and add them to the objectives array
        for (let i = 0; i < levelData.objectives.length; i++) {

            this.objectives.push(this.add.existing(new Objective(this,
                gameOptions.worldWidth * levelData.objectives[i].x,
                gameOptions.worldHeight * levelData.objectives[i].y,
                0xeec39a)));

        }

    }

}