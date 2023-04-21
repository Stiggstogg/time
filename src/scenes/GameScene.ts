import Phaser from 'phaser';
import Ship from '../sprites/Ship'
import Block from '../sprites/Block'
import Objective from '../sprites/Objective';
import gameOptions from '../helper/gameOptions';
import eventsCenter from '../helper/eventsCenter';
import {GameData, LevelData} from '../helper/interfaces';
import Indicator from "../sprites/Indicator";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private ship!: Ship;
    private objectives!: Objective[];
    private indicators!: Indicator[];
    private gameData!: GameData;
    private gameRunning!: boolean;

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

        // reset collision counter
        this.gameData.collisions = 0;

        // initialize variables
        this.objectives = [];
        this.indicators = [];
        this.gameRunning = false;       // make the game not running (timer not running at the beginning)

    }

    // Creates all objects of this scene
    create(): void {

        // start UI scene
        this.scene.launch('GameUI', this.gameData);

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

        // update the ship
        this.ship.update();

        // update the indicators
        for (let i = 0; i < this.indicators.length; i++) {
            this.indicators[i].update();
        }


    }

    // Add keyboard and touch input to the scene.
    addControls(): void {

        // add keyboard controls
        this.input.keyboard?.addKey('Space').on('down', function(this: GameScene) { this.inputPressed();}, this);

        // add mouse and touch controls
        this.input.on('pointerdown', function(this: GameScene) { this.inputPressed(); }, this);

    }

    // Action which happens when input is provided: Change direction of the spaceship
    inputPressed(): void {

        if (!this.gameRunning) {
            this.gameRunning = true;

            eventsCenter.emit('startgame');

        }

        this.ship.changeDirection();

    }

    // setup all the events and make sure they are also cleaned up at the end
    eventsHandlingSetup() {

        // event when the ship collides with blocks
        eventsCenter.on('blockCollide', function(this: GameScene) {

            this.gameData.collisions! += 1;

        }, this);

        // event when ship collides with objective
        eventsCenter.on('objectiveCollide', function(this: GameScene, objective: Objective) {

            const index = this.objectives.indexOf(objective);               // get the index of the objective in the array

            this.indicators[index].destroy();                               // destroy the indicator
            this.indicators.splice(index, 1);                     // remove the indicator from the list of indicators

            objective.destroy();                                            // destroy the objective
            this.objectives.splice(index, 1);                     // remove it from the list of objectives


            if (this.objectives.length < 1) {

                this.levelOver(true);                               // level is over with success
                
            }

        }, this);

        // event when the time is up
        eventsCenter.once('timeUp', function(this: GameScene) {

            this.levelOver(false);      // level is over and you did not make it on time (success: no)

        }, this);

        // Cleanup the events when the scene is shut down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, function() {
            eventsCenter.off('objectiveCollide');
            eventsCenter.off('blockCollide');
            eventsCenter.off('timeUp');
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
                gameOptions.worldHeight * levelData.blocks[i].y,
                gameOptions.worldWidth * levelData.blocks[i].width,
                gameOptions.worldHeight * levelData.blocks[i].height,
                levelData.blocks[i].angle));

        }

        // place all objectives and add them to the objectives array
        for (let i = 0; i < levelData.objectives.length; i++) {

            this.objectives.push(this.add.existing(new Objective(this,
                gameOptions.worldWidth * levelData.objectives[i].x,
                gameOptions.worldHeight * levelData.objectives[i].y,
                levelData.objectives[i].color)));

        }

        // create indicators (one for each objective and in exactly the same order!)
        for (let i = 0; i < this.objectives.length; i++) {

            this.indicators.push(this.add.existing(new Indicator(this, this.ship, this.objectives[i])));

        }

    }
    
    // level is over (either by elapsing time or by collecting all objectives)
    levelOver(successful: boolean) {

        this.gameData.successful = successful;                      // set the success
        
        if (successful) {          // successful

            console.log('you won');     // TODO: Add here other things

        }
        else {

            console.log('you lost');    // TODO: Add here other things

        }

        this.scene.stop('GameUI');
        this.scene.start('Points', this.gameData);              // go to the points scene
        
    }

}