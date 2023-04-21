import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';

// "Points" scene: Scene where the points you got in the last level are shown
export default class PointsScene extends Phaser.Scene {

    private gameData!: GameData;
    private levelPoints!: number;
    private collisionPoints!: number;
    private newPoints!: number;

    // Constructor
    constructor() {
        super({
            key: 'Points'
        });
    }

    // Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

    }

    // Shows the all objects of this scene
    create(): void {

        // Add title
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Points', gameOptions.textStyles[0]).setOrigin(0.5, 0.5);

        // calculate points
        this.calculatePoints();

        // Add texts
        this.addTexts();

        // Add buttons
        this.addButtons();


    }

    calculatePoints() {

        // calculate the points you get from completing the level or failing it!
        if (this.gameData.successful) {                                                 // level completed
            this.levelPoints = this.gameData.expectedPoints!;
        }
        else {                                                                          // level failed
            this.levelPoints = Math.round(- this.gameData.expectedPoints! / 2);
        }

        // calculate the points from the collisions
        this.collisionPoints = - this.gameData.collisions! * gameOptions.collisionPenalty;

        // calculate the new points
        this.newPoints = this.gameData.points + this.levelPoints + this.collisionPoints;

    }


    // add all texts
    addTexts() {

        const startY = 0.4;         // y position where the points start
        const spaceY = 0.04;         // space between the different points
        const posX = 0.8;           // x position where the points are added (right aligned)

        // Points
        this.add.text(gameOptions.gameWidth * posX,
            gameOptions.gameHeight * (startY),
            this.gameData.points.toString(),
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // Level points
        let levelPointsText = this.levelPoints.toString();

        if (this.levelPoints >= 0) {                                // add a plus when it is positive
            levelPointsText = '+' + this.levelPoints.toString();
        }

        this.add.text(gameOptions.gameWidth * posX,
            gameOptions.gameHeight * (startY + spaceY),
            levelPointsText,
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // Collision points
        let collisionPointsText = this.collisionPoints.toString();

        if (this.collisionPoints >= 0) {                                // add a plus when it is positive
            collisionPointsText = '+' + this.collisionPoints.toString();
        }
        this.add.text(gameOptions.gameWidth * posX,
            gameOptions.gameHeight * (startY + spaceY * 2),
            collisionPointsText,
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // final points
        this.add.text(gameOptions.gameWidth * posX,
            gameOptions.gameHeight * (startY + spaceY * 4),
            this.newPoints.toString(),
            gameOptions.textStyles[0]).setOrigin(1, 0.5);

    }


    // Add buttons including controls
    addButtons() {

        // button go to the next level or repeat the current one
        const buttonNext = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.8,
             'Continue', gameOptions.textStyles[1]);
        buttonNext.setInteractive();
        buttonNext.setOrigin(0.5, 0.5);                                                           // set position
        buttonNext.on('pointerdown', function(this: PointsScene) { this.next() }, this);      // add touch control

    }

    // Go to the next level or repeat the failed level
    next() {

        this.gameData.points = this.newPoints;

        if (this.gameData.successful) {            // level was completed successfully (go to the next level)

            this.gameData.level += 1;

        }

        this.scene.start('Estimate', this.gameData);        // go to the estimation scene of the next or this level

    }

}