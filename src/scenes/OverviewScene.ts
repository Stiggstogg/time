import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData, LevelData} from "../helper/interfaces";
import Button from "../sprites/Button";

// "Overview" scene: Scene where you see the overview of the level
export default class OverviewScene extends Phaser.Scene {

    private level!: number;

    // Constructor
    constructor() {
        super({
            key: 'Overview'
        });
    }

    // Initialize parameters
    init(data: GameData): void {

        // make this scene directly invisible when it is started (needs to be done like that as start / launch makes it visible again)
        this.scene.setVisible(false);

        // get game data
        this.level = data.level;        // get the level number

    }

    // Shows the all objects of this scene
    create(): void {

        // create world (background and cameras)
        this.createWorld();

        // draw level
        this.drawLevel();

        // add frame of the map
        this.addFrame();

        // Add buttons
        this.addButtons();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }


    // create world (background and boundaries)
    createWorld() {

        // set camera
        this.cameras.main.setBounds(0, 0, gameOptions.worldWidth, gameOptions.worldHeight);
        this.cameras.main.setScroll(gameOptions.worldWidth / 2, gameOptions.worldHeight - gameOptions.gameHeight);
        this.cameras.main.setZoom(gameOptions.gameWidth / gameOptions.worldWidth);

        // add background
        this.add.image(0, 0, 'backgroundMap').setOrigin(0).setScale(3);


    }

    // create level
    drawLevel() {

        // get the level and the data
        const levelString: string = 'level' + this.level.toString();   // create the string with the level name (key to the loaded json)
        const levelData: LevelData = this.cache.json.get(levelString);  // get the data from the json

        // place the ship
        this.add.image(
            gameOptions.worldWidth * levelData.ship.x,
            gameOptions.worldHeight * levelData.ship.y,
            'ship'
        );

        // place all blocks
        for (let i = 0; i < levelData.blocks.length; i++) {

            this.add.image(
                gameOptions.worldWidth * levelData.blocks[i].x,
                gameOptions.worldHeight * levelData.blocks[i].y,
                'block',
            ).setAngle(levelData.blocks[i].angle)
                .setDisplaySize(
                    gameOptions.worldWidth * levelData.blocks[i].width,
                    gameOptions.worldHeight * levelData.blocks[i].height)
                .setTint(0x000000);
        }

        // place all objectives
        for (let i = 0; i < levelData.objectives.length; i++) {

            this.add.image(
                gameOptions.worldWidth * levelData.objectives[i].x,
                gameOptions.worldHeight * levelData.objectives[i].y,
                'objective',
            );

        }
    }

    // add frame
    addFrame() {

        // add background
        this.add.image(0, 0, 'frameMap').setOrigin(0).setScale(3);

    }

    // Add buttons including controls
    addButtons() {

        // button to back to the estimation scene
        const buttonBack = this.add.existing(new Button(this,
                gameOptions.worldWidth * 0.67,
                gameOptions.worldHeight * 0.95,
                'Back'
            ));

        buttonBack.setScale(3);
        buttonBack.button.on('pointerdown', function(this: OverviewScene) { this.backToEstimate() }, this);      // add touch control

    }

    // Go back to the estimation scene
    backToEstimate() {

        this.scene.pause();
        this.scene.setVisible(false);
        this.scene.resume('Estimate');

    }

}