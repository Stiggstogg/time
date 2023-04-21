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

        // Add congratulation message and corresponding buttons
        this.addMessageAndButtons();

        // Add texts
        this.addPointsTexts();


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
    addPointsTexts() {

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


    // Add congratulation message (or failed ;) and button to do the next action
    // (next level or go back to menu when the last level was completed)

    addMessageAndButtons(): void {

        const lastLevel = this.gameData.level == gameOptions.numLevels;

        // Add empty button and then modify it later
        const button = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.8,
            ' ', gameOptions.textStyles[1]);
        button.setInteractive();
        button.setOrigin(0.5, 0.5);

        // add an empty text and modify it later
        const text = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.3,
            ' ', gameOptions.textStyles[1]).setOrigin(0.5, 0.5);

        // Modify text and buttons based on if it was successful and the last level
        if (lastLevel && this.gameData.successful) {                        // Level was successful and it was the last one

            // button
            button.setText('Done');
            button.on('pointerdown', function(this: PointsScene) {

                this.gameData.points = this.newPoints;
                this.scene.start('Home');               // go back to menu

            }, this);

            // message
            text.setText('All levels done!');

        }
        else if (!lastLevel && this.gameData.successful) {                      // successful but there are still some levels

            // button
            button.setText('Next Level');
            button.on('pointerdown', function(this: PointsScene) {

                this.gameData.level += 1;                                       // set the level to the next one

                this.gameData.points = this.newPoints;
                this.scene.start('Estimate', this.gameData);               // go back the estimation scene (next level)

            }, this);

            // message
            text.setText('Mission accomplished');

        }
        else {                                                                      // not successful (repeat level)

            // button
            button.setText('Repeat Level');
            button.on('pointerdown', function(this: PointsScene) {

                this.gameData.points = this.newPoints;
                this.scene.start('Estimate', this.gameData);               // go back the estimation scene (same level)

            }, this);

            // go back the estimation scene (next level)
            text.setText('FAILED!');

        }
    }

}
